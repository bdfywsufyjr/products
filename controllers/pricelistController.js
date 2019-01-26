var Pricelist                   = require('../models/pricelist');
var Product                     = require('../models/product');
var Competitor                  = require('../models/competitor');

var xml2js                      = require('xml2js');
var parser                      = new xml2js.Parser();
var rp                          = require('request-promise');
var errors                      = require('request-promise/errors');

var helper                      = require('../helper');

var competitorController        = require('./competitorController');


/**
 * Routes handling methods
 */

// GET pricelist
exports.getPriceList = async (req, res) => {

    var findCriteria = {};

    Product.findOne({'productId': req.params.productId})
        .exec( (err, product) => {
            if (err) { res.json({'success': false, 'message': 'Product ' + req.params.productId + 'does not found'}); }

            var regxp = new RegExp(product.searchText, 'i');
            findCriteria.$or = [
                //{ 'competitorCode': regxp},
                { 'manufacturerCode': regxp}
            ];

            Pricelist.find(findCriteria)
                .exec(function (err, pricelist) {
                    if (err) { res.json({'success': false, 'message': err.message}); }

                    res.json({
                        'success': true,
                        'message': pricelist.length + ' prices for product ' + product.searchText + ' found!',
                        'data': pricelist
                    });
                });

        });
};

// GET competitor pricelist update.
exports.priceList_update_get = async (req, res) => {

    const settings = await competitorController.getOptions(req.params.competitorId);

    const resSchema = settings.resSchema;

    var options = {
        method: 'GET',
        url: settings.url,
        qs: JSON.parse(settings.reqSchema)
    };

    rp(options)
        .then( content => {

            var data = content.toString().replace("\ufeff", "");

            parser.parseString(data, (err, object) => {
                if (err) {
                    res.json({success: false, message: 'Parse string error: ' + err});

                    return;
                }

                const data = string_to_ref(object, settings.resSchema.path);

                /**
                 * Fetch products and match with products from response
                 */

                Product.find({})
                    .exec( (err, list_product) => {
                        if (err) { console.log(err); }

                        var matchedProducts = data.filter(o1 => list_product.find(o2 => {
                            var code = JSON.parse(JSON.stringify(string_to_ref(o1, resSchema.manufacturerCode)).replace(/ /g, ''));

                            return code == o2.manufacturerCode
                        }));

                        //TODO: Remove [0] from new Pricelist object

                        var priceList = matchedProducts.map(object => {
                            return new Pricelist(
                                {
                                    competitor:         settings._id,
                                    manufacturerCode:   object.manufacturerCode[0],
                                    price:              object.price[0],
                                    stock:              object.stockQuantity[0],
                                }
                            )
                        });

                        /**
                         * Pricelist completely overwritten at every update.
                         * Ledger must be added
                         */

                        Pricelist.deleteMany({ competitor: settings._id }, error => {
                            if (error) {
                                res.json({'success': false, 'message': error.message});

                                return;
                            } else {
                                Pricelist.insertMany(priceList, (err, objects) => {
                                    if (err) {
                                        res.json({'success': false, 'message': err.message});

                                        return;
                                    }

                                    res.json({'success': true, 'message': objects.length + ' products to pricelist successfully added!', 'data': objects});
                                })
                            }
                        });
                    });
            });
        })
        .catch(errors.StatusCodeError, (reason) => {
            res.json({
                success: false,
                message: 'The server responded with a status codes other than 2xx. Error: ' + reason
            });
        })
        .catch(errors.RequestError, (reason) => {
            res.json({
                success: false,
                message: 'The request failed due to technical reasons.. Error: ' + reason
            });
        });
};