import express from "express";
import { 
  getSingleLocation, 
  getAllLocations, 
  createLocation, 
  updateLocation,
  addBookToLocation,
  getBooksAtLocation
} from "../controllers/locations.js";

const router = express.Router();

const placeholder = (req, res) => {
  res.json({ message: "This is a placeholder" });
}

router.get("/", getAllLocations);
router.get("/:id", getSingleLocation);
router.post("/", createLocation);
router.put("/:id", updateLocation);
// router.delete("/:id", placeholder);

router.get("/:id/books", getBooksAtLocation);
router.post("/:id/books/:bookId/add", addBookToLocation);

export default router;