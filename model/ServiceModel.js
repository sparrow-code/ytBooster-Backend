import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    // Service Name
    name: { type: String },
    price: { type: String },
    quantity: { type: String },
    serviceID: {
      type: Number, // mongoose.Schema.Types.ObjectId
      ref: "Order",
    },
    parentService: { type: String },
    provider: { type: String },
    status: { type: String, default: "Inactive" },
    apiName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
