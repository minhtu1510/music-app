import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    status: String,
    type_user: String,
    slug: {
      type: String,
      slug: "fullName",
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema, "users");
