import db from "../db/config.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getSingleLocation = async (req, res) => {
  const { id } = req.params;
  try {
    // const results = await db.one("SELECT * FROM locations WHERE id = $1", id);
    const results = await prisma.locations.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    res.json(results);
  }
  catch(err) {
    res.status(404).json({error: "The location could not be found"});
  }
}

const getAllLocations = async (req, res) => {
  // const results = await db.query("SELECT * FROM locations ORDER BY id");
  const results = await prisma.locations.findMany();
  res.json(results);
}

const createLocation = async (req, res) => {
  const { name } = req.body;
  try {
    // const createdLocation = await db.one(
    //   "INSERT INTO locations (name) VALUES ($1) RETURNING *", [name]
    // );
    const createdLocation = await prisma.locations.create({
      data: {
        name
      }
    })
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
    // const updatedLocation = await db.one(
    //   "UPDATE locations SET name = $1 WHERE id = $2 RETURNING *", [name, id]
    // );
    const updatedLocation = await prisma.locations.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name
      }
    })
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

    // const booksAtLocations = await db.one(`
    //   SELECT SUM(quantity) FROM books_locations WHERE book_id = $1`, [bookId]
    // );

    const booksAtLocations = await prisma.books_locations.aggregate({
      _sum: {
        quantity: true
      },
      where: {
        book_id: parseInt(bookId)
      }
    });

    const currentBookCount = parseInt(booksAtLocations._sum.quantity);

    // const bookResult = await db.one("SELECT quantity FROM books WHERE id = $1", bookId);
    const bookResult = await prisma.books.findUnique({
      where: {
        id: parseInt(bookId)
      },
      select: {
        quantity: true
      }
    });
    const bookQuantity = bookResult.quantity;

    if(currentBookCount + quantity > bookQuantity) {
      return res.status(400).json({
        error: "The system does not have enough books to provide this amount to this location"
      });
    }

    // const results = await db.one(
    //   "INSERT INTO books_locations (location_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING *", [id, bookId, quantity]
    // );

    const results = await prisma.books_locations.create({
      data: {
        location_id: parseInt(id),
        book_id: parseInt(bookId),
        quantity
      }
    })
    res.json(results);
  }
  catch(err) {
    console.log(err);
    res.status(400).json({error: "The book could not be added to the location"});
  }
}

const getBooksAtLocation = async (req, res) => {
  const { id } = req.params;
  try {
    // const results = await db.query(`
    //   SELECT books.title, books_locations.quantity AS quantity, locations.name AS location
    //   FROM locations
    //   LEFT JOIN books_locations ON locations.id = books_locations.location_id
    //   LEFT JOIN books ON books_locations.book_id = books.id
    //   WHERE locations.id = $1
    // `, id);

    const results = await prisma.locations.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        books_locations: {
          select: {
            quantity: true,
            books: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    console.log(results);

    const booksAtLocation = results.books_locations.map(bookLocation => {
      return {
        title: bookLocation.books.title,
        quantity: bookLocation.quantity
      }
    
    })

    // const locationName = results[0].location;
    // const books = results.map(book => {
    //   return {
    //     title: book.title,
    //     quantity: book.quantity
    //   }
    // });

    // const resultObj = {
    //   location: locationName,
    //   books: books.filter(b => b.title)
    // }

    results.books = booksAtLocation;
    delete results.books_locations;

    res.json(results);
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