/**
 * Created by alok on 6/4/16.
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('ProductDetails', {

    productName:String,
    actor: String,
    activity: String,
    feature: String
});