import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    
    title : { type: String },
    details : { type : String },
    jobName : { type: String },
    time : { type: String },
    image: { type: String, default: "/api/img/notification/favicon.png" },  
    status: { type: String, default: "Inactive" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
