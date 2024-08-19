import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    link: { type: String }, // youtube link
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // service id
    order_id: { type: Number }, // order id generate squence
    smm_order: { type: String, default: "0" }, // order id in smm
    status: { type: String, default: "Pending" }, // order status
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
