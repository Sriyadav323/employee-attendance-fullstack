import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    leaveBalance: {
      type: Number,
      default: 18,
    },

    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    approvalStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /*
     * PASSWORD RESET
     *
     * We never store the actual reset token.
     * Only its SHA-256 hash is stored.
     */
    passwordResetTokenHash: {
      type: String,
      default: null,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model(
  "User",
  UserSchema
);