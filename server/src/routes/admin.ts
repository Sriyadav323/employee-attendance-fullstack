import { Router } from "express";

import { User } from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
import { generateUniqueEmployeeId } from "../utils/employeeId.js";
import { Attendance } from "../models/Attendance.js";
import { AttendanceCorrection } from "../models/AttendanceCorrection.js";

export const adminRouter =
  Router();

/*
 * Everything below requires
 * administrator access.
 */
adminRouter.use(requireAdmin);

/*
 * GET PENDING ACCESS REQUESTS
 */
adminRouter.get(
  "/access-requests",

  async (_req, res) => {
    const users =
      await User.find({
        approvalStatus:
          "pending",
      })
        .select(
          "-passwordHash -passwordResetTokenHash"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(
      users
    );
  }
);

adminRouter.get(
  "/attendance-corrections",
  async (_req, res) => {
    const corrections =
      await AttendanceCorrection.find({
        status: "pending",
      })
        .populate(
          "userId",
          "name email employeeId department"
        )
        .sort({ createdAt: -1 });

    return res.json(corrections);
  }
);

adminRouter.patch(
  "/attendance-corrections/:id/:decision",
  async (req, res) => {
    const { decision } = req.params;

    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({
        message: "Invalid review decision",
      });
    }

    const correction =
      await AttendanceCorrection.findById(req.params.id);

    if (!correction) {
      return res.status(404).json({
        message: "Correction request not found",
      });
    }

    if (correction.status !== "pending") {
      return res.status(409).json({
        message: "Correction request has already been reviewed",
      });
    }

    if (decision === "approve") {
      await Attendance.findOneAndUpdate(
        {
          userId: correction.userId,
          attendanceDate: correction.attendanceDate,
        },
        {
          $set: {
            checkInAt: correction.requestedCheckInAt,
            checkOutAt: correction.requestedCheckOutAt,
          },
        },
        { upsert: true, new: true }
      );
    }

    correction.status =
      decision === "approve" ? "approved" : "rejected";
    correction.reviewedBy = req.userId as any;
    correction.reviewedAt = new Date();
    await correction.save();

    return res.json({
      message: `Correction ${correction.status} successfully`,
      correction,
    });
  }
);

/*
 * GET ALL USERS
 */
adminRouter.get(
  "/users",

  async (_req, res) => {
    const users =
      await User.find({})
        .select(
          "-passwordHash -passwordResetTokenHash"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(
      users
    );
  }
);

/*
 * APPROVE USER
 */
adminRouter.patch(
  "/access-requests/:id/approve",

  async (req, res) => {
    const adminId =
      req.userId;

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found",
        });
    }

    if (
      user.approvalStatus ===
      "approved"
    ) {
      return res
        .status(400)
        .json({
          message:
            "User is already approved",
        });
    }

    if (!user.employeeId) {
      user.employeeId =
        await generateUniqueEmployeeId();
    }

    user.approvalStatus =
      "approved";

    user.approvedAt =
      new Date();

    user.approvedBy =
      adminId as any;

    await user.save();

    return res.json({
      message:
        "User approved successfully",
      user,
    });
  }
);

/*
 * REJECT USER
 */
adminRouter.patch(
  "/access-requests/:id/reject",

  async (req, res) => {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found",
        });
    }

    if (
      user.approvalStatus ===
      "rejected"
    ) {
      return res
        .status(400)
        .json({
          message:
            "User is already rejected",
        });
    }

    user.approvalStatus =
      "rejected";

    user.approvedAt =
      null;

    user.approvedBy =
      null;

    await user.save();

    return res.json({
      message:
        "User rejected successfully",
      user,
    });
  }
);
