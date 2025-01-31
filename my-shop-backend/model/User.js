import mongoose from "mongoose";
import { ROLE } from "./role.js";

const userSchema = mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roleId: {
    type: Number,
    default: ROLE.READER
  },
});

const User = mongoose.model("User", userSchema);

export default User;
