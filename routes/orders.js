import express from "express";
import {
  getOrder,
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/order.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/all", getOrders);
router.get("/:id", getOrder);
router.get("/user/:id", getUserOrders);

router.post("/", createOrder);
router.patch("/update/:id", userAuth, updateOrderStatus);

export default router;
