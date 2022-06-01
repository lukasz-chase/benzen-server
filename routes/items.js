import express from "express";
import {
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
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/search", getItemsBySearch);
router.get("/sale", getAllItemsOnSale);
router.get("/:id", getItem);
router.get("/favorites/:id", getFavoriteItems);
router.get("/item/:id", getItemsByItem);
router.get("/sale/:id", getItemsOnSale);
router.patch("/decreaseAmount/:id", decreaseAmount);

router.post("/", adminAuth, upload.any("images"), createItem);
router.delete("/delete/:id", adminAuth, deleteItem);
router.patch("/update/:id", adminAuth, updateItem);

export default router;
