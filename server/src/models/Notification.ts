import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["account", "attendance", "correction", "leave", "system"], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    readAt: { type: Date, default: null },
    key: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
