const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookIsbn = req.params.isbn;
    const bookRequested = books[bookIsbn];
    if (bookRequested) {
        res.send(JSON.stringify(bookRequested,null,4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const bookAuthor = req.params.author;
    const booksByAuthor = [];

    for (let i in books){
        if (books[i].author === bookAuthor){
            booksByAuthor.push(books[i]);
        }
    }

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor,null,4));
    } else {
        res.status(404).json({ message: "Author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = req.params.title;
    const booksByTitle = [];

    for (let i in books){
        if (books[i].title === bookTitle){
            booksByTitle.push(books[i]);
        }
    }

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle,null,4));
    } else {
        res.status(404).json({ message: "Title not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const bookIsbn = req.params.isbn;
    const bookRequested = books[bookIsbn];
    if (bookRequested) {
        res.send(JSON.stringify(bookRequested.reviews,null,4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
