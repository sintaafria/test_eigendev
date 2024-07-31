const express = require('express');
const LibraryController = require('../controller/LibraryController');
const router = express.Router();


router.post('/borrow-book', LibraryController.borrowBook);
router.post('/return-book', LibraryController.returnBook)
router.post('/members', LibraryController.addBatchMembers);
router.get('/members', LibraryController.getAllMembers);
router.post('/books', LibraryController.addBatchBooks);
router.get('/books', LibraryController.getAllBooks);

module.exports = router;