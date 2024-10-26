import { Schema, model, Types } from "mongoose";

const cryptoSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "Name must to be minimum 2 characters long!"]
  },
  image: {
    type: String,
    required: true,
    validate: [/^https?:\/\//, "Image must to start with http:// or https:// "]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must to be positive number!"]
  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Description must be minimum 10 character long!"]
  },
  payment: {
    type: String,
    required: true,
    enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
  },
  buyCrypto: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Crypto = model("Crypto", cryptoSchema);

export default Crypto;
