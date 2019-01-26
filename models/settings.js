var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var SettingsSchema = new Schema(
    {
        login: { type: String, required: true },
        password: { type: String, required: true },
        interval: { type: String, enum: ['15', '30', '60'], default: '30', required: true },
        catalog: { type: String, required: false},
        manufacturer: { type: String, required: false},
        updated_at: { type: Date, default: Date.now }
    }
);

// Virtual for setting's URL
SettingsSchema
    .virtual('url')
    .get(function () {
        return '/data/settings/';
    });

//Export model
module.exports = mongoose.model('Settings', SettingsSchema);