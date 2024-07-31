const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    penalty_end_date: {
        type: Date
    }
});

module.exports = mongoose.model('Member', MemberSchema);
