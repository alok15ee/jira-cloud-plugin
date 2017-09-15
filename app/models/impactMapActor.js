
var mongoose = require('mongoose');

module.exports = mongoose.model('ImpactMapActor', {

    productName:String,
    checked: Boolean,
    actor: String

});
