import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  item: String,
  amount: Number,
  gender: String,
  category: String,
  description: String,
  price: Number,
  discount: Boolean,
  priceBeforeDiscount: Number,
  materials: [
    {
      fabric: String,
      percentage: Number,
    },
  ],
  images: [String],
});
itemSchema.index({ price: 1 });
const item = mongoose.model("itemSchema", itemSchema);

export default item;
