import express from "express";

import { 
  getSingleBook, 
  getAllBooks, 
  createBook, 
  updateBook, 
  deleteBook 
} from "../controllers/books.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;