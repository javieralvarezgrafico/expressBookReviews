const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TAREA 6. Register new user
public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({ message: "User " + username + " successfully registered. Now you can login" });
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else {
        // Return error if username or password is missing
        return res.status(404).json({message: "Unable to register user."});
    }
});

// TAREA 1. Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// TAREA 2. Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookIsbn = req.params.isbn;
    const bookRequested = books[bookIsbn];
    if (bookRequested) {
        res.send(JSON.stringify(bookRequested,null,4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });
  
// TAREA 3. Get book details based on author
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

// TAREA 4. Get all books based on title
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

// TAREA 5. Get book review
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
