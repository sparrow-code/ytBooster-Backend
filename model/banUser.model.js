// ? For Ban User

import mongoose from "mongoose";

const banUserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    instaId: { type: String, required: true },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const BanUserModel = mongoose.model("BanUser", banUserSchema);

export default BanUserModel;
