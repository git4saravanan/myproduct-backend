const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Products = new Schema({
    product_name: {
        type: String
    },
    product_description:{
        type: String
    },
    product_price:{
        type: String
    },
    product_offer: {
        type: String
    },
    product_usage: {
        type: String
    },
    product_image: {
        type: String
    }
});

module.exports = mongoose.model('ProductModel',Products);