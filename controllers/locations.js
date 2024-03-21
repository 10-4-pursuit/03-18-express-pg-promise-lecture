import db from "../db/config.js";

const getSingleLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.one("SELECT * FROM locations WHERE id = $1", id);
    res.json(results);
  }
  catch(err) {
    res.status(404).json({error: "The location could not be found"});
  }
}

const getAllLocations = async (req, res) => {
  const results = await db.query("SELECT * FROM locations ORDER BY id");
  res.json(results);
}

const createLocation = async (req, res) => {
  const { name } = req.body;
  try {
    const createdLocation = await db.one(
      "INSERT INTO locations (name) VALUES ($1) RETURNING *", [name]
    );
    res.json(createdLocation);
  }
  catch(err) {
    res.status(400).json({error: "The location could not be created"});
  }
}

const updateLocation = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const updatedLocation = await db.one(
      "UPDATE locations SET name = $1 WHERE id = $2 RETURNING *", [name, id]
    );
    res.json(updatedLocation);
  }
  catch(err) {
    res.status(400).json({error: "The location could not be updated"});
  }
}

const addBookToLocation = async (req, res) => {
  const { id, bookId } = req.params;
  const { quantity } = req.body;
  try {

    const booksAtLocations = await db.one(`
      SELECT SUM(quantity) FROM books_locations WHERE book_id = $1`, [bookId]
    );
    const currentBookCount = parseInt(booksAtLocations.sum);

    const bookResult = await db.one("SELECT quantity FROM books WHERE id = $1", bookId);
    const bookQuantity = bookResult.quantity;

    if(currentBookCount + quantity > bookQuantity) {
      return res.status(400).json({
        error: "The system does not have enough books to provide this amount to this location"
      });
    }

    const results = await db.one(
      "INSERT INTO books_locations (location_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING *", [id, bookId, quantity]
    );
    res.json(results);
  }
  catch(err) {
    res.status(400).json({error: "The book could not be added to the location"});
  }
}

const getBooksAtLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.query(`
      SELECT books.title, books_locations.quantity AS quantity, locations.name AS location
      FROM locations
      LEFT JOIN books_locations ON locations.id = books_locations.location_id
      LEFT JOIN books ON books_locations.book_id = books.id
      WHERE locations.id = $1
    `, id);

    const locationName = results[0].location;
    const books = results.map(book => {
      return {
        title: book.title,
        quantity: book.quantity
      }
    });

    const resultObj = {
      location: locationName,
      books: books.filter(b => b.title)
    }

    res.json(resultObj);
  }
  catch(err) {
    console.log(err);
    res.status(404).json({error: "The location could not be found"});
  }
}

export {  
  getSingleLocation,
  getAllLocations,
  createLocation,
  updateLocation,
  addBookToLocation,
  getBooksAtLocation,
}