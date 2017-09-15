/**
 * Created by alok on 6/4/16.
 */



var mongoose = require('mongoose');

module.exports = mongoose.model('TargetGroup', {

    productName:String,
    actor: [{ type:'String' }]
});