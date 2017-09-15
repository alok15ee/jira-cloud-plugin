


var mongoose = require('mongoose');

module.exports = mongoose.model('ImpactMapFeature', {

    productName: String,
    actor: String,
    activity: String,
    feature: String,
    issueKey: String,
    checked: Boolean
});



