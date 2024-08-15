import mongoose from "mongoose";

const ProxySchema = new mongoose.Schema(
  {
    // Proxy User Name
    userName: { type: String },
    pswd: { type: String },
    ip: { type: String },
    port: { type: Number },
    status: { type: String, default: "Deactive" },
  },
  { timestamps: true }
);

export default mongoose.model("Proxy", ProxySchema);
