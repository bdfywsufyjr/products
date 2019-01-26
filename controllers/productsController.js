var Product                     = require('../models/product');

var xml2js                      = require('xml2js');
var parser                      = new xml2js.Parser();
var rp                          = require('request-promise');
var errors                      = require('request-promise/errors');

var xlsx                        = require('xlsx');
var fs                          = require('fs');

var settingsController          = require('../controllers/settingsController');


exports.readExcelFile = async () => {

    const res = new Promise ( (resolve, reject) => {
        fs.readFile('./public/inbox/products.xlsx', (err, content) => (err) ? reject(err) : resolve(content));
    });

    return res.then( content => {
        const workbook = xlsx.read(content, {type:'buffer'})
        const workbookSheets = workbook.SheetNames;

        return xlsx.utils.sheet_to_json(workbook.Sheets[workbookSheets[0]]);
    }).catch( error => Promise.reject(error));

};

/**
 * Routes handling methods
 */

// Index page
exports.index = async (req, res, next) => {

    //TODO: Finish

    readExcelFile();

    Product.find({})
        .exec(function (err, list_product) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('product_list', { title: 'Available products', product_list: list_product });
        });
};

// GET product list
exports.getProductList = async (req, res, next) => {

    Product.find({})
        .exec(function (err, list_product) {
            if (err) { return next(err); }

            res.json({'success': true, 'message':'', 'data': list_product});
        });
};

// GET product list update from excel file
exports.productList_update_get = async (req, res) => {

    var result = await this.readExcelFile();

    var products = result.map( object => {

        return new Product(
            {
                productId: parseInt(object['Short Item No'], 10),
                productName: JSON.stringify(object['Description']).replace(/ /g, ''),
                manufacturerCode: JSON.parse(JSON.stringify(object['Item No Customer Vendor']).replace(/ /g, '')),
                searchText: JSON.stringify(object['Search Text']).replace(/ /g, ''),
                vendor: JSON.stringify(object['Manufacturer']).replace(/ /g, ''),
                catalog: JSON.stringify(object['Adm Sublevel']).replace(/ /g, ''),
                price: parseFloat(object['Unit Cost']),
                stock: JSON.stringify(object['Qty on Hand']).replace(/ /g, '')
            }
        );
    });

    Product.deleteMany({}, error => {
        if (error) {
            res.json({'success': false, 'message': error.message});

            return;
        } else {
            Product.insertMany(products, (err, objects) => {
                if (err) {
                    res.json({'success': false, 'message': err.message});

                    return;
                }

                res.json({'success': true, 'message': objects.length + ' products successfully added!', 'data': objects});
            })
        }
    });
};

// GET product details
exports.getProduct = (req, res, next) => {

    Product.find({'productId': req.params.id})
        .exec(function (err, product) {
            if (err) { res.json({'success': false, 'message': err.message}); }

            res.json({'success': true, 'message':'', 'data': product});
        });
};
