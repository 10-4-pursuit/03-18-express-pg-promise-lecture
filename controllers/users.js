import db from "../db/config.js";

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.one("SELECT * FROM users WHERE id = $1", id);
    res.json(results);
  }
  catch(err) {
    res.status(404).json({error: "The user could not be found"});
  }
}

const getAllUsers = async (req, res) => {
  const results = await db.query("SELECT * FROM users ORDER BY id");
  res.json(results);
}

const createUser = async (req, res) => {
  const { username } = req.body;
  try {
    const createdUser = await db.one(
      "INSERT INTO users (username) VALUES ($1) RETURNING *", username
    );
    res.json(createdUser);
  }
  catch(err) {
    res.status(400).json({error: "The user could not be created"});
  }
}

const updateUser = async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;
  try {
    const updatedUser = await db.one(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING *", [username, id]
    );
    res.json(updatedUser);
  }
  catch(err) {
    res.status(400).json({error: "The user could not be updated"});
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await db.one(
      "DELETE FROM users WHERE id = $1 RETURNING *", id
    );
    res.json(deletedUser);
  }
  catch(err) {
    res.status(400).json({error: "The user could not be deleted"});
  }
}

const checkoutBook = async (req, res) => {
  const { id } = req.params;
  const { bookId } = req.body;

  try {
    const book = await db.one("SELECT * FROM books WHERE id = $1", bookId);
    
    const currentlyCheckedOut = await db.one(`
      SELECT COUNT(*) FROM users_books WHERE book_id = $1
    `, [bookId]);

    const checkedOutCount = parseInt(currentlyCheckedOut.count);

    if(checkedOutCount >= book.quantity) {
      return res.status(400).json({error: "No copies available"});
    }
    else {
      const insertResult = await db.one(
        "INSERT INTO users_books (user_id, book_id) VALUES ($1, $2) RETURNING *", [id, bookId]
      );
      return res.json(insertResult);
    }
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: "The user or book could not be found"});
  }
}

const checkedOutBooksByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.query(`
      SELECT * FROM users 
      JOIN users_books ON users.id = users_books.user_id
      JOIN books ON users_books.book_id = books.id
      WHERE users.id = $1
    `, id);
    res.json(results);
  }
  catch(err) {
    res.status(404).json({error: "The user could not be found"});
  }

}

export { 
  getSingleUser, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  checkoutBook, 
  checkedOutBooksByUser 
};