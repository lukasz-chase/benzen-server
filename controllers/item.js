import express from "express";
import mongoose from "mongoose";

import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

const router = express.Router();

export const getItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    res.status(200).json(item);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getItemsByItem = async (req, res) => {
  const { gender, order, page, category } = req.query;
  const { id } = req.params;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Item.countDocuments({
      gender: gender,
      item: id,
      category,
    });
    const items = await Item.find({
      gender: gender,
      item: id,
      category,
    })
      .sort({ price: order })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: items,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getFavoriteItems = async (req, res) => {
  const { page } = req.query;
  const { id } = req.params;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const user = await User.findById(id);
    const total = await Item.countDocuments({});
    const items = await Item.find({
      _id: { $in: user.favorites },
    })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: items,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getItemsBySearch = async (req, res) => {
  const { searchQuery, gender, page, order } = req.query;
  try {
    const query = new RegExp(searchQuery, "i");
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Item.countDocuments({
      gender: gender,
      $or: [
        { item: query },
        { description: query },
        { category: query },
        { item: query },
        { name: query },
      ],
    });
    const items = await Item.find({
      gender: gender,
      $or: [
        { item: query },
        { description: query },
        { category: query },
        { item: query },
        { name: query },
      ],
    })
      .sort({ price: order })
      .limit(LIMIT)
      .skip(startIndex);
    res.json({
      data: items,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getItemsOnSale = async (req, res) => {
  const { gender, page, order } = req.query;
  const { id } = req.params;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Item.countDocuments({
      discount: true,
      item: id,
      gender: gender,
    });
    const items = await Item.find({
      discount: true,
      item: id,
      gender: gender,
    })
      .sort({ price: order })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: items,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllItemsOnSale = async (req, res) => {
  const { gender } = req.query;
  try {
    const items = await Item.find({
      discount: true,
      gender: gender,
    });

    res.status(200).json({
      items,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  const item = req.body;
  const newItem = new Item(item);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    gender,
    category,
    item,
    amount,
    discount,
    price,
    priceBeforeDiscount,
    description,
    materials,
    images,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No item with id: ${id}`);
  const updatedItem = {
    name,
    gender,
    category,
    item,
    amount,
    discount,
    price,
    priceBeforeDiscount,
    description,
    materials,
    images,
    _id: id,
  };
  await Item.findByIdAndUpdate(id, updatedItem, { new: true });

  res.json(updatedItem);
};
export const decreaseAmount = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No item with id: ${id}`);
  const oldItem = await Item.findById(id);
  await Item.findByIdAndUpdate(
    id,
    { $set: { amount: oldItem.amount - 1 } },
    { new: true }
  );

  res.json(oldItem);
};
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No item with id: ${id}`);
  await Item.findByIdAndRemove(id);

  res.json({ message: "Item deleted successfully." });
};

export default router;
