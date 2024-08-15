import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    username : { type: String, required: true },
    password : { type: String, required: true },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
