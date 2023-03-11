const express = require("express");
const {getBookbyId, registerNewBook,getAllBooks,updateBook,deleteBook, issueBook } = require("../controllers/bookController");
const router = express.Router();

router.route("/add").post(registerNewBook);
router.route("/get").get(getAllBooks);
router.route('/update').post(updateBook);
router.route('/delete').post(deleteBook);
router.route('/issue').post(issueBook);
router.route('/myBooks').post(getBookbyId);
module.exports = router;
