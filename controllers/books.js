const books = [
  "The Great Gatsby", 
  "The Catcher in the Rye", 
  "To Kill a Mockingbird",
  "The Three Kingdoms",
  "Rashomon"
];

import db from "../db/config.js";

const getSingleBook = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.one("SELECT * FROM books WHERE id = $1", id);
    res.json(results);
  }
  catch(err) {
    res.status(404).json({error: "The book could not be found"});
  }
}

const getAllBooks = async (req, res) => {
  const results = await db.query("SELECT * FROM books");
  res.json(results);
}

const createBook = async (req, res) => {
  const { title } = req.body;

  if(title) {
    const result = await db.one("INSERT INTO books (title) VALUES ($1) RETURNING *", title);
    res.json(result);
  }
  else {
    res.status(400).json({error: "The title is required"});
  }
}

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    if(!title) {
      return res.status(400).json({error: "The title is required"});
    }
    else {
      const result = await db.one("UPDATE books SET title = $1 WHERE id = $2 RETURNING *", [title, id]);
      res.json(result);
    }
  }
  catch(err) {
    res.status(404).json({error: "The book could not be found"});
  }
}

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.one("DELETE FROM books WHERE id = $1 RETURNING *", id);
    res.json(result);
  }
  catch(err) {
    res.status(404).json({error: "The book could not be found"});
  }
}

export { getSingleBook, getAllBooks, createBook, updateBook, deleteBook };
