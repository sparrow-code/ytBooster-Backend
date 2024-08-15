import mongoose from "mongoose";

const SmmAPISchema = new mongoose.Schema(
  {
    // API Key Name
    name: { type: String },
    // API Key URL
    smmURL: {
      type: String,
      required: [true, "API URL is Important"],
    },
    // API Key
    apiKEY: {
      type: String,
      required: [true, "API Key is Mandatory"],
    },
    // API Description
    apiDescription: { type: String },

    status: { type: String, default: "Inactive" },
  },
  { timestamps: true }
);

export default mongoose.model("SmmAPI", SmmAPISchema);
