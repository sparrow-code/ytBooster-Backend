import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userName: { type: String },
    posts: { type: Array },
    serviceID: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    quantity: { type: Number },
    amount: { type: Number },
    transactionId: { type: String },
    orderId: { type: Number },
    approvalRefNo: { type: String },
    order: { type: Array },
    status: { type: String, default: "Pending" }, // User Status
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
