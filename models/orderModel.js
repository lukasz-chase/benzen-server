import mongoose from "mongoose";
import { addressSchema } from "./addressModel.js";
const { Schema } = mongoose;

export const orderSchema = new Schema({
  address: addressSchema,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  paymentType: String,
  userId: String,
  cartPrice: Number,
  status: String,
  deliveryPrice: Number,
  cart: [
    {
      cartAmount: Number,
      img: String,
      name: String,
      size: String,
      discount: Number,
      price: Number,
      priceBeforeDiscount: Number,
      id: String,
    },
  ],
  deliveryType: String,
});

export default mongoose.model("Order", orderSchema);
