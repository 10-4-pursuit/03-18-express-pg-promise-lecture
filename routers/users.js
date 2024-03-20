import express from "express";

import { 
  getSingleUser, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  checkoutBook,
  checkedOutBooksByUser
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.put("/:id/checkout", checkoutBook);
router.get("/:id/checked-out", checkedOutBooksByUser)

export default router;