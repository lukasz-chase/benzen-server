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
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    cb(null, `${id}-${file.originalname}`);
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

router.post("/", upload.any("images"), createItem);
router.delete("/delete/:id", adminAuth, deleteItem);
router.patch("/update/:id", adminAuth, updateItem);

export default router;
