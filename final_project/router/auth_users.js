const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// TAREA 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const bookIsbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;
    const bookRequested = books[bookIsbn];

    if (!bookRequested) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    bookRequested.reviews[username] = review;
    return res.status(200).json({ message: "Review successfully added/updated." });
});

// TAREA 9.
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookIsbn = req.params.isbn;
    const username = req.session.authorization?.username;
    const bookReviewed = books[bookIsbn];

    if (!bookReviewed) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!bookReviewed.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user." });
    }

    delete bookReviewed.reviews[username];

    return res.status(200).json({ message: "Review from user " + username + " deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
