import express from "express";
import mongoose from "mongoose";

import Order from "../models/orderModel.js";

const router = express.Router();

export const getOrders = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Order.countDocuments({});
    const orders = await Order.find().limit(LIMIT).skip(startIndex);
    res.status(200).json({
      data: orders,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Order.countDocuments({});
    const orders = await Order.find({ userId: id })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: orders,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const order = req.body;
  const newOrder = new Order(order);
  try {
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No order with id: ${id}`);

  await Order.findByIdAndUpdate(
    id,
    { $set: { status: status } },
    { new: true }
  );
  const order = await Order.findById(id);
  res.json(order);
};

export default router;
