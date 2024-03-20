import express from "express";

import { 
  getSingleBook, 
  getAllBooks, 
  createBook, 
  updateBook, 
  deleteBook,
  getCheckedOutBooks
} from "../controllers/books.js";

const router = express.Router();

router.get("/checked-out", getCheckedOutBooks)

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);



export default router;