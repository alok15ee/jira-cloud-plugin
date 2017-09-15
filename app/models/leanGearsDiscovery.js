
var mongoose = require('mongoose');

module.exports = mongoose.model('DiscoveryProduct', {
    projectKey: String,
    productName:String,
    endUsers:String,
    problemsArea: String,
    productKind: String,
    problemSoln: String,
    competitors: String,
    differentiator: String,
    discoverer: String,
    shared: String,
});

