import mongoose from "mongoose";

const InstagramSchema = new mongoose.Schema(
  {
    instaID: {
      type: String,
      required: [true, "Enter Instagram ID"],
      unique: true,
    },
    profilePic: {
      type: String,
    },
    usrName: {
      type: String,
      required: [true, "Enter User Name"],
      unique: true,
    },
    fullName: {
      type: String,
    },
    number: {
      type: Number,
    },
    follower: {
      type: String,
    },
    following: {
      type: String,
    },
    post: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    imei: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Instagram", InstagramSchema);
