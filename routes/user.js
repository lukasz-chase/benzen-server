import express from "express";
import {
  signin,
  signup,
  getUserById,
  favoriteItemHandler,
  addAddress,
  updateAddress,
  deleteAddress,
  updateInfo,
  updatePassword,
  deleteAccount,
  getUsers,
  updateRole,
} from "../controllers/user.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/updateInfo/:id", updateInfo);
router.patch("/updateRole/:id", adminAuth, updateRole);
router.patch("/updatePassword/:id", updatePassword);
router.patch("/addToFavorites/:id", favoriteItemHandler);
router.patch("/addAddress/:id", userAuth, addAddress);
router.patch("/updateAddress/:id", userAuth, updateAddress);
router.patch("/deleteAddress/:id", userAuth, deleteAddress);
router.delete("/deleteAccount/:id", userAuth, deleteAccount);

export default router;
