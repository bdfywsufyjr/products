var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompetitorSchema = new Schema(
    {
        name:           { type: String, required: true },
        url:            { type: String },
        reqSchema:      { type: String },
        resSchema:      {
            path:               { type: String },
            competitorCode:     { type: String },
            manufacturerCode:   { type: String },
            price:              { type: String },
            stock:              { type: String }
        },
        created_at:     { type: Date, default: Date.now }
    }
);

// Virtual for competitor
CompetitorSchema
    .virtual('competitor')
    .get(function () {
        return this._id;
    });


//Export model
module.exports = mongoose.model('Competitor', CompetitorSchema);