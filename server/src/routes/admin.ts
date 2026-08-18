import { Router } from "express";
import { z } from "zod";

import { User } from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";

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

    const { employeeId } = z
      .object({
        employeeId: z
          .string()
          .trim()
          .toUpperCase()
          .regex(
            /^[A-Z0-9][A-Z0-9-]{2,19}$/,
            "Employee ID must be 3-20 characters using letters, numbers, or hyphens"
          ),
      })
      .parse(req.body);

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

    const employeeIdInUse =
      await User.exists({
        employeeId,
        _id: {
          $ne: user._id,
        },
      });

    if (employeeIdInUse) {
      return res
        .status(409)
        .json({
          message:
            "This Employee ID is already assigned to another user",
        });
    }

    user.employeeId =
      employeeId;

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
