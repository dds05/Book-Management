const Book = require("../models/bookModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// add a  new book in database
const registerNewBook = asyncHandler(async (req, res) => {
  const { bookName,authorName, year, noOfCopies } = req.body;

  const ifBookAlreadyExists = await Book.findOne({ bookName });
  if (ifBookAlreadyExists) {
    res.status(400);
    throw new Error("Book already exists!");
  }

  const book = await Book.create({
    bookName,
    authorName,
    year,
    noOfCopies,
  });
  if (book) {
    res.status(200).json({
      _id: book._id,
      bookname:book.bookName,
      authorname: book.authorName,
      year: book.year,
      noOfCopies: book.noOfCopies,
    });
  } else {
    res.status(400);
    throw new Error("Some Error Occured");
  }
});

// get all books from database
const getAllBooks = asyncHandler(async (req, res) => {
  Book.find()
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch();
});

// update quantity of Book in database
const updateBook = asyncHandler(async (req, res) => {
  const { operation, id } = req.body;
  let ObjectId = require("mongodb").ObjectId;
  let searchid = new ObjectId(id);
  const findBook = await Book.findById({ _id: searchid });

  if (findBook) {
    if (operation === "add") {
      const doc = await Book.findOneAndUpdate(
        { _id: findBook._id },
        { $inc: { noOfCopies: 1 } }
      );
      // console.log(doc);
      res.status(200).json({
        data: doc,
      });
    } else if (operation == "subtract") {
      const doc = await Book.findOneAndUpdate(
        { _id: findBook._id },
        { $inc: { noOfCopies: -1 } }
      );
      // console.log(doc);
      res.status(200).json({
        data: doc,
      });
    }
  } else {
    res.status(400);
    throw new Error("Some Error Occured");
  }
});

// Delete Book From DataBase
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.body;
  Book.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      // console.log(err);
    } else {
      res.status(200).json({ msg: "Deleted Successfully!" });
    }
  });
});

//  Issue a book to a particular user
const issueBook = asyncHandler(async (req, res) => {
  const { bookid, userid } = req.body;
  let ObjectId = require("mongodb").ObjectId;
  let searchid = new ObjectId(bookid);
  const findBook = await Book.findById({ _id: searchid });

  if (findBook) {
    if (findBook.noOfCopies > 0) {
      const doc = await Book.findOneAndUpdate(
        { _id: findBook._id },
        { $inc: { noOfCopies: -1 } }
      );

      let user = await User.findById(userid);
      let MyBooks = user.myBooks;
      let checker;
      let traverser = MyBooks.map((ele) => {
        let idToCompare = new ObjectId(ele._id);
        if (idToCompare.equals(doc._id)) {
          checker = { ...ele };
          return true;
        } else {
          return false;
        }
      });

      // console.log(traverser);

      let decider = isBookIdFoundinUserCollection(traverser);
      // console.log(decider);
      if (!decider) {
        // console.log("entry1");
        let result = await User.findByIdAndUpdate(
          userid,
          {
            $push: {
              myBooks: {
                _id: doc._id,
                authorName: doc.authorName,
                bookName:doc.bookName,
                year: doc.year,
                noOfCopies: 1,
              },
            },
          },
          { new: true }
        );
        checker = null;
      } else {
        // console.log("entry2");

        let newList = MyBooks.filter((ele) => {
          let comp1 = new ObjectId(ele._id);
          let comp2 = new ObjectId(checker._id);
          return !comp1.equals(comp2);
        });
        // console.log(newList);
        // console.log(checker);
        let val = checker.noOfCopies + 1;
        // console.log(val);
        let result = await User.findByIdAndUpdate(
          userid,
          {
            $set: {
              myBooks: [
                ...newList,
                {
                  _id: checker._id,
                  authorName: checker.authorName,
                  bookName: checker.bookName,
                  year: checker.year,
                  noOfCopies: val,
                },
              ],
            },
          },
          { new: true }
        );

        checker = null;
      }

      res.status(200).json({
        data: doc,
      });
    }
  } else {
    res.status(400);
    throw new Error("Some Error Occured");
  }
});

//  to check if a user already has a book in his collection with same-ID
const isBookIdFoundinUserCollection = (traverser) => {
  for (let i = 0; i < traverser.length; i++) {
    if (traverser[i] == true) return true;
  }
  return false;
};

// to get books based on a particular user-Id
const getBookbyId = asyncHandler(async (req, res) => {
  const { id } = req.body;
  let ObjectId = require("mongodb").ObjectId;
  let searchid = new ObjectId(id);
  const books = await User.findById({ _id: searchid });
  if (books) {
    // console.log(books);
    res.status(200).json({
      data: books,
    });
  } else {
    res.status(400);
    throw new Error("Some Error Occured");
  }
});

module.exports = {
  issueBook,
  registerNewBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookbyId,
};
