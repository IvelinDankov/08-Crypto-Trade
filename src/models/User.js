import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const salt = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"]
  },
  email: {
    type: String,
    required: [true, "Email is required!"]
  },
  password: {
    type: String,
    required: [true, "Password is required!"]
  },
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

const User = model("User", userSchema);

export default User;
