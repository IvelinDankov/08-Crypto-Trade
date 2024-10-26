import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const salt = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    minLength: [5, "Username min characters is 5,please try again!"]
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    minLength: [10, "Email min characters is 10, please try again!"]
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [4, "Password min characters is 4, please try again!"]
  },
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

const User = model("User", userSchema);

export default User;
