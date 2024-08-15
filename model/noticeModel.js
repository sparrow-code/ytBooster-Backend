import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String },
    body:  { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", NoticeSchema);
