import mongoose from "mongoose";
const { Schema } = mongoose;

export const addressSchema = new Schema({
  city: String,
  street: String,
  houseNr: String,
  postalCode: String,
  phone: String,
});

export default mongoose.model("Address", addressSchema);
