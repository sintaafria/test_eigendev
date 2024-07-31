const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    copies: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: function(){
            return this.copies
        }
    }
});

module.exports = mongoose.model('Book', BookSchema);