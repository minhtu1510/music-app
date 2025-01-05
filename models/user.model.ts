import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    googleId: String,
    password: String,
    token: String,
    avatar: {
      type: String,
      default:
        "http://res.cloudinary.com/dimlzdbay/image/upload/v1736007630/kv5ct122jzq8mcubnmjs.jpg",
    },
    phone: String,
    status: {
      type: String,
      default: "active",
    },
    type_user: {
      type: String,
      default: "basic",
    },
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
