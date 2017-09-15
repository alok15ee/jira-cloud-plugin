/**
 * Created by root on 15/4/16.
 */




var mongoose = require('mongoose');

module.exports = mongoose.model('hypothesis', {

    productName:String,
    hypothesis: String,

});


