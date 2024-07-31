const BookRepository = require("../repositories/BookRepository");
const BorrowTransactionRepository = require("../repositories/BorrowTransactionRepository");
const MemberRepository = require("../repositories/MemberRepository");

class LibraryService {
	async borrowBook(member_code, book_code) {
		const member = await MemberRepository.findByCode(member_code);

		if (!member) throw new Error("Member is not found");

		const borrowedBooksCount =
			await BorrowTransactionRepository.countBorrowedBookByUserId(
				member.id
			);

		if (member.penalty_end_date && member.penalty_end_date > new Date())
			throw new Error("Member is currently penalized");
		if (borrowedBooksCount >= 2)
			throw new Error("Member cannot borrow more than 2 books");

		const book = await BookRepository.findByCode(book_code);
		if (!book) throw new Error("Book is not found");
		if (book.stock <= 0) throw new Error("Book is not available");

		await BorrowTransactionRepository.addLoanTransaction(
			member.id,
			book._id
		);
		await BookRepository.updateStock(book._id, book.stock - 1);
	}

	async returnBook(member_code, book_code) {
		const member = await MemberRepository.findByCode(member_code);
		if (!member) throw new Error("Member is not found");

		const book = await BookRepository.findByCode(book_code);
		if (!book) throw new Error("Book is not found");

		const borrowedBook = await BorrowTransactionRepository.findOne({
			member_id: member._id,
			book_id: book._id,
			return_date: null,
		});
		if (!borrowedBook)
			throw new Error("This book was not borrowed by this member");

		await BorrowTransactionRepository.setReturnDate(member.id, book._id);
		await BookRepository.updateStock(book._id, book.stock + 1);

		const borrowDuration = Math.floor(
			(new Date() - borrowedBook.borrow_date) / (1000 * 60 * 60 * 24)
		);
		if (borrowDuration > 7) {
			penalty_end_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
			await MemberRepository.updateMember(member._id, {
				penalty_end_date,
			});
		}
	}
	async addBatchBooks(books) {
		return await BookRepository.saveBatch(books);
	}
	async getAllBooks() {
		return await BookRepository.findAll();
	}
	async addBatchMembers(members) {
		return await MemberRepository.saveBatch(members);
	}
	async getAllMembers() {
		const members = await MemberRepository.findAll();
		const borrowed_books_count =
			await BorrowTransactionRepository.findAllMemberBorrowed();

		const member_map = {};
		borrowed_books_count.forEach(item => {
			member_map[item._id] = item.books_borrowed;
		});

		return members.map(member => ({
			code: member.code,
			name: member.name,
			borrowed_books: member_map[member._id] || 0,
		}));
	}
}

module.exports = new LibraryService();
