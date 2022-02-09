var mongoose = require("mongoose");
var schema = mongoose.Schema;
const _ = require("lodash");

var item = new schema(
    {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        date: { type: Date },
        image: { type: String, default: '' }
    },
    { timestamps: true, }
);

let models = mongoose.modelNames();
let Items = !_.includes(models, 'Item') ? mongoose.model('Item', item) : mongoose.models['Item'];

module.exports = {
    Items,
    item
};
