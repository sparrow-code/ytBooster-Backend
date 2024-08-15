import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    userPswd : { type: String },
    role: { type: String },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
