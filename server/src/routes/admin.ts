import { Router } from "express";
import { z } from "zod";

import { User } from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
import { generateUniqueEmployeeId } from "../utils/employeeId.js";
import { Attendance } from "../models/Attendance.js";
import { AttendanceCorrection } from "../models/AttendanceCorrection.js";
import { notify } from "../utils/notifications.js";

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

    await notify({
      userId: correction.userId,
      type: "correction",
      title: `Attendance correction ${correction.status}`,
      message: `Your attendance correction for ${correction.attendanceDate} was ${correction.status}.`,
      key: `correction:${correction.id}:${correction.status}`,
    });

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
 * UPDATE A USER'S PORTAL ROLE
 */
adminRouter.patch(
  "/users/:id/role",

  async (req, res) => {
    const parsed = z
      .object({
        role: z.enum(["employee", "admin"]),
      })
      .safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Choose a valid employee role",
      });
    }

    if (req.userId === req.params.id) {
      return res.status(400).json({
        message: "You cannot change your own administrator role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.approvalStatus !== "approved") {
      return res.status(400).json({
        message: "Approve this account before assigning a role",
      });
    }

    user.role = parsed.data.role;
    await user.save();

    await notify({
      userId: user._id,
      type: "account",
      title: "Portal role updated",
      message: `Your portal role is now ${parsed.data.role}.`,
      key: `role:${user.id}:${parsed.data.role}:${Date.now()}`,
    });

    return res.json({
      message: `${user.name} is now an ${parsed.data.role}`,
      user,
    });
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

    await notify({
      userId: user._id,
      type: "account",
      title: "Account approved",
      message: "Your account has been approved. You can now access the employee portal.",
      key: `account:${user.id}:approved`,
    });

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

    await notify({
      userId: user._id,
      type: "account",
      title: "Account request rejected",
      message: "Your account request was not approved. Contact an administrator for assistance.",
      key: `account:${user.id}:rejected`,
    });

    return res.json({
      message:
        "User rejected successfully",
      user,
    });
  }
);
