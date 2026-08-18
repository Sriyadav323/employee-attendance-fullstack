import mongoose, { Schema } from "mongoose";

const AttendanceCorrectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    attendanceDate: {
      type: String,
      required: true,
      index: true,
    },
    requestedCheckInAt: {
      type: Date,
      required: true,
    },
    requestedCheckOutAt: {
      type: Date,
      default: null,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

AttendanceCorrectionSchema.index({
  userId: 1,
  attendanceDate: 1,
  status: 1,
});

export const AttendanceCorrection = mongoose.model(
  "AttendanceCorrection",
  AttendanceCorrectionSchema
);
