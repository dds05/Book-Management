const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    bookName:{
      type: String,
      required: true,
      unique:true
    },
    authorName: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    noOfCopies: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const book = mongoose.model("Book", bookSchema);
module.exports = book;
