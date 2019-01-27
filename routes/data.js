var path = require('path');
require('dotenv').config({path: path.join(__dirname, ".env")});
var secret = process.env.SECRET;

var express                     = require('express');
var router                      = express.Router();

// Require controller modules.
var product_controller            = require('../controllers/productsController');
var pricelist_controller          = require('../controllers/pricelistController');
var settings_controller           = require('../controllers/settingsController');
var competitor_controller         = require('../controllers/competitorController');


// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

// GET data home page.
router.get('/', product_controller.index);

/// PRODUCTS ROUTES ///

// GET product list.
router.get('/product', product_controller.getProductList);

// GET product list update.
router.get('/product/update', product_controller.productList_update_get);

// GET product details.
router.get('/product/:id', product_controller.getProduct);

/// PRICELIST ROUTES ///

// GET competitor pricelist update.
router.get('/pricelist/update/:competitorId', pricelist_controller.priceList_update_get);

// GET pricelist.
router.get('/pricelist/:productId', pricelist_controller.getPriceList);

/// COMPETITOR ROUTES ///

//GET competitors list
router.get('/competitor', competitor_controller.index);

// GET competitor settings.
router.get('/competitor/:id', competitor_controller.getCompetitor);

// GET request for competitor settings creating.
router.get('/competitor/create', competitor_controller.competitor_create_get);

// POST request for competitor settings creating.
router.post('/competitor/create', competitor_controller.competitor_create_post);

/// SETTINGS ROUTES ///

// GET settings home page.
router.get('/settings', settings_controller.index);

// GET settings information.
router.get('/settings/global', settings_controller.getSettings);

// GET request for settings creating.
router.get('/settings/create', settings_controller.settings_create_get);

// POST request for settings creating.
router.post('/settings/create', settings_controller.settings_create_post);

// GET settings update
router.get('/settings/:id/update', settings_controller.settings_update_get);

// POST settings update
router.post('/settings/:id/update', settings_controller.settings_update_post);

// GET request to delete settings.
router.get('/settings/:id/delete', settings_controller.settings_delete_get);


module.exports = router;
