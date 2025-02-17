import mongoose from "mongoose";
const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    role_title: String,
    createdBy: String,
    createdAt: Date,
    createdByFullName: String,
    createdAtFormat: String,
    updatedBy: String,
    updatedAt: Date,
    updatedByFullName: String,
    updatedAtFormat: String,
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
export const Account = mongoose.model("Account", accountSchema, "accounts");
