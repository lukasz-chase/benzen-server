import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import mongoose from "mongoose";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn`t exist" });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id, role: oldUser.role },
      "test",
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, name, surname } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: name,
      surname: surname,
      role: "customer",
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, role: result.role },
      "test",
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  const { role, searchQuery, page } = req.query;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await User.countDocuments({});
    const query = new RegExp(searchQuery, "i");
    const users = await User.find({
      role: role,
      $or: [{ name: query }, { email: query }],
    })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: users,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const favoriteItemHandler = async (req, res) => {
  const { id } = req.params;
  const { itemId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  const user = await User.findById(id);
  const item = await Item.findById(itemId);

  const index = user.favorites.findIndex((id) => id === String(item._id));

  if (index === -1) {
    user.favorites.push(item._id);
  } else {
    user.favorites = user.favorites.filter((id) => id !== String(item._id));
  }

  const updatedUser = await User.findByIdAndUpdate(id, user, {
    new: true,
  });

  res.status(200).json(updatedUser);
};
export const addAddress = async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  const user = await User.findById(id);
  await User.findByIdAndUpdate(
    id,
    { $set: { address: [...user.address, address] } },
    { new: true }
  );
  const updatedUser = await User.findById(id);

  res.json(updatedUser);
};
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.findByIdAndUpdate(
    id,
    { $set: { password: hashedPassword } },
    { new: true }
  );
  const updatedUser = await User.findById(id);

  res.json(updatedUser);
};
export const updateInfo = async (req, res) => {
  const { id } = req.params;

  const { name, surname, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  await User.findByIdAndUpdate(
    id,
    { $set: { name: name, surname: surname, email: email } },
    { new: true }
  );

  const user = await User.findById(id);

  res.json(user);
};
export const updateRole = async (req, res) => {
  const { id } = req.params;

  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  await User.findByIdAndUpdate(id, { $set: { role: role } }, { new: true });

  const user = await User.findById(id);

  res.json(user);
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;

  const { address, addressId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  const user = await User.findById(id);

  user.address = user.address.map((add) =>
    String(add._id) === addressId ? { ...address, _id: add._id } : add
  );

  await User.findByIdAndUpdate(id, user, { new: true });

  res.json(user);
};
export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const { addressId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  const user = await User.findById(id);
  user.address = user.address.filter(
    (add) => String(add._id) !== String(addressId)
  );
  await User.findByIdAndUpdate(id, user, { new: true });

  res.json(user);
};
export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  await User.findByIdAndRemove(id);

  res.json({ message: "User deleted successfully." });
};
