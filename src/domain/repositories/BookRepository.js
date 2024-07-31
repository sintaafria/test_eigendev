const BookModel = require('../models/BookModel')

class BookRepository {
    async findByCode(book_code) {
        const book = await BookModel.findOne({code: book_code});
        return book
    }
    async findAll() {
        const book = await BookModel.find().select("-_id -__v -copies");
        return book
    }
    async save(book) {
        const bookModel = new BookModel(book);
        return await bookModel.save();
    }
    async saveBatch(books) {
        const new_books = await BookModel.insertMany(books);
        return new_books
    }
    async updateStock(book_id, stock){
        const updated_book = await BookModel.findOneAndUpdate(book_id, {stock})
        return updated_book
    }
}

module.exports = new BookRepository;