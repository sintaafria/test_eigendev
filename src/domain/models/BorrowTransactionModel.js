const mongoose = require('mongoose');

const BorrowTransactionSchema = new mongoose.Schema({
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    borrow_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    return_date: {
        type: Date
    }
});

module.exports = mongoose.model('borrow-transaction', BorrowTransactionSchema);