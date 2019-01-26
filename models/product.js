var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
    {
        productId:          { type: Number, required: true, unique: true },
        productName:        { type: String },
        manufacturerCode:   { type: String },
        searchText:         { type: String },
        vendorCode:         { type: String },
        catalogCode:        { type: String },
        price:              { type: Number },
        stock:              { type: String },
        created_at:         { type: Date, default: Date.now }
    }
);

// Virtual for product
ProductSchema
    .virtual('product')
    .get(function () {
        return this.productId;
    });

// Virtual for product's URL
ProductSchema
    .virtual('url')
    .get(function () {
        return '/data/product/' + this._id;
    });

//Export model
module.exports = mongoose.model('Product', ProductSchema);