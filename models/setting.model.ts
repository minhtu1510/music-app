import mongoose from "mongoose";
const settingSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true,
  }
);
export const Setting = mongoose.model("Setting", settingSchema, "settings");
