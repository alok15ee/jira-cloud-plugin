

var mongoose = require('mongoose');

module.exports = mongoose.model('ImpactMapActivity', {

    productName:String,
    actor: String,
    activity: String,
    checked: Boolean

});



