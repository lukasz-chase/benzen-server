import mongoose from "mongoose";
import { addressSchema } from "./addressModel.js";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: String,
  surname: String,
  role: String,
  address: { type: [addressSchema], default: [] },
  favorites: { type: [String], default: [] },
});

export default mongoose.model("User", userSchema);
