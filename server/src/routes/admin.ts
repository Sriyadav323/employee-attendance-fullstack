import { Router } from "express";

import { User } from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
import { generateUniqueEmployeeId } from "../utils/employeeId.js";

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
