const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    todo_name: String,
    status: String
    // Thêm các trường khác nếu cần
});

module.exports = mongoose.model('List', listSchema);