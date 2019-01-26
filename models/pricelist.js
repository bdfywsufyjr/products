var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PricelistSchema = new Schema(
    {
        competitor:         { type: Schema.Types.ObjectId, ref: 'Competitor', required: true },
        manufacturerCode:   { type: String },
        price:              { type: Number },
        stock:              { type: String },
        created_at:         { type: Date, default: Date.now }
    }
);

// Virtual for pricelist
PricelistSchema
    .virtual('pricelist')
    .get(function () {
        return this.productId;
    });

// Virtual for pricelist's URL
PricelistSchema
    .virtual('url')
    .get(function () {
        return '/data/pricelist/' + this._id;
    });

//Export model
module.exports = mongoose.model('Pricelist', PricelistSchema);