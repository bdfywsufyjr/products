var Settings        = require('../models/settings');
let agenda          = require('../jobs/agenda');

var async = require('async');

// Render error page
exports.error = function(req, res) {
    res.render('error', {message: req});
};

// Render settings home page
exports.index = function(req, res) {
    Settings.find({})
        .exec(function (err, list_settings) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('settings_list', { title: 'Настройки', settings_list: list_settings });
        });
};

// Get settings

exports.getSettings = () => {
    return Settings.findOne({}, null, {sort: {updated_at: -1}})
        .exec()
        .then((res) => {
            return res;
        })
}

// Display Settings create form on GET.
exports.settings_create_get = function(req, res) {

    res.render('settings_form', { title: 'Настройки', settings: '' });
};

// Global Settings create form on POST.
exports.settings_create_post = function(req, res, next) {

    let interval = req.body.interval;
    let settings = new Settings(
        {
            login: req.body.login,
            password: req.body.password,
            interval: interval,
            catalog: req.body.catalog,
            manufacturer: req.body.manufacturer
        }
    );

    agenda.every(interval + ' minutes', 'productsList');

    Settings.findOne({ 'login': req.body.login })
        .exec( function(err, found_settings) {
            if (err) { return next(err); }

            if (found_settings) {
                // Settings exists, redirect to its detail page.
                res.redirect(found_settings.url);
            }
            else {
                settings.save(function (err) {
                    if (err) { console.log(err); }
                    // Settings saved. Redirect to settings index page.
                    res.redirect(settings.url);
                });
            }
        });
};

// Display Settings update form on GET.
exports.settings_update_get = function(req, res, next) {

    Settings.findById(req.params.id)
        .exec(function (err, settings) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('settings_form', { title: 'Настройки', settings: settings });
        });
};

// Handle Settings update on POST.
exports.settings_update_post = function(req, res) {

    let interval = req.body.interval;
    let editedSettings = new Settings(
        {
            login:      req.body.login,
            password:   req.body.password,
            interval:   interval,
            catalog: req.body.catalog,
            manufacturer: req.body.manufacturer,
            _id:        req.params.id //This is required, or a new ID will be assigned!
        });

    agenda.every(interval + ' minutes', 'productsList');

    //agenda.cancel({name: 'read-folder'}, (err, numRemoved) => {
    //    console.log('Removed jobs: ' + numRemoved);
    //});


    Settings.findByIdAndUpdate(req.params.id, editedSettings, {}, function (err,settings) {
        if (err) { return next(err); }

        res.redirect(settings.url);
    });

};

// Display Settings delete form on GET.
exports.settings_delete_get = function(req, res) {
    Settings.findByIdAndRemove(req.params.id, (err, settings) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Settings successfully deleted",
            id: settings._id
        };

        return res.json({'status': '200', 'response': response});
    });
};


