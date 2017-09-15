/**
 * Created by alok on 6/4/16.
 */



var mongoose = require('mongoose');

module.exports = mongoose.model('BigPicture', {

    productName:String,
    actor: String,
    activity: String,
});


