const LibraryService = require("../../domain/services/libraryService");


class LibraryController {
	async borrowBook(req, res) {
		try {
			const { member_code, book_code } = req.body;
			await LibraryService.borrowBook(member_code, book_code);
			res.status(200).send({ message: "Book borrowed successfully" });
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}
	async returnBook(req, res) {
		try {
			const { member_code, book_code } = req.body;
			await LibraryService.returnBook(member_code, book_code);
			res.status(200).send({ message: "Book returned successfully" });
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}

	async addBatchBooks(req, res) {
		try {
			const books = await LibraryService.addBatchBooks(req.body);
			res.status(200).send(books);
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}

	async getAllBooks(req, res) {
		try {
			const books = await LibraryService.getAllBooks();
			res.status(200).send(books);
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}

	async addBatchMembers(req, res) {
		try {
			const members = await LibraryService.addBatchMembers(req.body);
			res.status(200).send(members);
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}

	async getAllMembers(req, res) {
		try {
			const members = await LibraryService.getAllMembers();
			res.status(200).send(members);
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}
}

module.exports = new LibraryController();
