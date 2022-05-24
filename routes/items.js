import express from "express";
import {
  getItems,
  createItem,
  getItem,
  getItemsByItem,
  getItemsBySearch,
  getItemsOnSale,
  updateItem,
  deleteItem,
  decreaseAmount,
  getFavoriteItems,
  getAllItemsOnSale,
} from "../controllers/item.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/search", getItemsBySearch);
router.get("/sale", getAllItemsOnSale);
router.get("/:id", getItem);
router.get("/favorites/:id", getFavoriteItems);
router.get("/item/:id", getItemsByItem);
router.get("/sale/:id", getItemsOnSale);
router.patch("/decreaseAmount/:id", decreaseAmount);

router.post("/", adminAuth, createItem);
router.delete("/delete/:id", adminAuth, deleteItem);
router.patch("/update/:id", adminAuth, updateItem);

export default router;
