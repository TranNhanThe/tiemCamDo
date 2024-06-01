const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    bsx: String,
    kho: String
    // Thêm các trường khác nếu cần
});

module.exports = mongoose.model('Bike', bikeSchema);