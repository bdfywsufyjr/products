var rp                          = require('request-promise');
var errors                      = require('request-promise/errors');

var productsController          = require('../../controllers/productsController');

module.exports = (agenda) => {
    agenda.define('productsList', async () => {

        var options = {
            method: 'GET',
            url: 'http://localhost:3000/data/product/update',
        };

        rp(options)
            .then( content => {
                console.log('Updated at ' + Date.now() + '! ' + content)
            })
            .catch(errors.StatusCodeError, (reason) => {
                console.log('The server responded with a status codes other than 2xx.');
                console.log('Error: ' + reason);
                // The server responded with a status codes other than 2xx.
            })
            .catch(errors.RequestError, (reason) => {
                console.log('The request failed due to technical reasons.');
                console.log('Error: ' + reason);
                // The request failed due to technical reasons.
            });
    });
};