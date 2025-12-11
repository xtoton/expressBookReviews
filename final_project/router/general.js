const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check existing user
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register user
  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    let getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    let allBooks = await getBooks;
    return res.status(200).json(allBooks);

  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    let findBook = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    let book = await findBook;
    return res.status(200).json(book);

  } catch (err) {
    return res.status(404).json({ message: err });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    let findByAuthor = new Promise((resolve, reject) => {
      let results = [];

      Object.keys(books).forEach(key => {
        if (books[key].author === author) {
          results.push(books[key]);
        }
      });

      if (results.length > 0) resolve(results);
      else reject("No books found for this author");
    });

    let authorBooks = await findByAuthor;
    return res.status(200).json(authorBooks);

  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    let findByTitle = new Promise((resolve, reject) => {
      let results = [];

      Object.keys(books).forEach(key => {
        if (books[key].title === title) {
          results.push(books[key]);
        }
      });

      if (results.length > 0) resolve(results);
      else reject("No books found with this title");
    });

    let titleBooks = await findByTitle;
    return res.status(200).json(titleBooks);

  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
