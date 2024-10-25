import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const register = async (username, email, password, rePass) => {
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (password !== rePass) {
    throw new Error("Password mismatch");
  }

  if (user) {
    throw new Error("User already exist!");
  }
  const newUser = await User.create({ username, email, password });

  return generateToken(newUser);
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid user or password!");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid user or password!");
  }

  return generateToken(user);
};

function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "5d" });

  return token;
}

export default {
  register,
  login,
};
