import mongoose from "mongoose";

const GatewaySchema = new mongoose.Schema(
  {
    // Gateway Name
    name: { type: String },
    // Gateway URL
    upi : { type: String },
    status: { type: String, default: "Inactive" },
  },
  { timestamps: true }
);

export default mongoose.model("Gateway", GatewaySchema);
