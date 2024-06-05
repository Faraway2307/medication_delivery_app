    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var userSchema = new Schema({
        _id : Number,
        medId: Number,
        quantity: String
    });

    module.exports = mongoose.model('stock', userSchema);