const BorrowTransactionModel = require('../models/BorrowTransactionModel')

class BorrowTransactionRepository {
    async findOne(data) {
        const loan = await BorrowTransactionModel.findOne(data);
        return loan
    }
    async findAll() {
        const loan = await BorrowTransactionModel.find();
        return loan
    }
    async findAllMemberBorrowed(){
        const memberBookCounts = await BorrowTransactionModel.aggregate([
            { $match: { return_date: null } },
            { $group: { _id: '$member_id', books_borrowed: { $sum: 1 } } }
        ])
        return memberBookCounts
    }
    async countBorrowedBookByUserId(member_id){
        const memberBookCounts = await BorrowTransactionModel.countDocuments({ member_id, return_date: null })
        return memberBookCounts
    }
    async addLoanTransaction(member_id, book_id) {
        const loan = new BorrowTransactionModel({member_id, book_id});
        return await loan.save()
    }
    async setReturnDate(member_id, book_id) {
        const loan =  BorrowTransactionModel.findOneAndUpdate(
            {member_id, book_id}, 
            {return_date: new Date()}
        );
        return loan
    }
}

module.exports = new BorrowTransactionRepository;
