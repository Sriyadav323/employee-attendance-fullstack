import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

import {
  sendPasswordResetEmail,
} from "../services/email.js";

export const authRouter =
  Router();

/* =========================================================
   REGISTER
========================================================= */

authRouter.post(
  "/register",
  async (req, res) => {
    const input = z
      .object({
        name: z
          .string()
          .trim()
          .min(
            2,
            "Name is required"
          ),

        email: z
          .string()
          .email(
            "Enter a valid email address"
          ),

        password: z
          .string()
          .min(
            8,
            "Password must contain at least 8 characters"
          ),

        phone: z
          .string()
          .trim()
          .max(20)
          .optional(),

        department: z
          .string()
          .trim()
          .min(
            2,
            "Department is required"
          ),
      })
      .parse(req.body);

    const email =
      input.email
        .trim()
        .toLowerCase();

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res
        .status(409)
        .json({
          message:
            "An account already exists for this email address.",
        });
    }

    const passwordHash =
      await bcrypt.hash(
        input.password,
        12
      );

    const user =
      await User.create({
        name:
          input.name,

        email,

        passwordHash,

        phone:
          input.phone || "",

        department:
          input.department,

        role:
          "employee",

        approvalStatus:
          "pending",

        leaveBalance:
          18,
      });

    return res
      .status(201)
      .json({
        message:
          "Registration submitted successfully. Your account is waiting for administrator approval.",

        request: {
          id:
            user.id,

          name:
            user.name,

          email:
            user.email,

          department:
            user.department,

          approvalStatus:
            user.approvalStatus,
        },
      });
  }
);

/* =========================================================
   LOGIN
========================================================= */

authRouter.post(
  "/login",
  async (req, res) => {
    const input = z
      .object({
        email: z
          .string()
          .email(
            "Enter a valid email address"
          ),

        password: z
          .string()
          .min(
            8,
            "Password must contain at least 8 characters"
          ),
      })
      .parse(req.body);

    const email =
      input.email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email,
      });

    if (
      !user ||
      !(await bcrypt.compare(
        input.password,
        user.passwordHash
      ))
    ) {
      return res
        .status(401)
        .json({
          message:
            "Invalid email or password",
        });
    }

    if (
      user.approvalStatus ===
      "pending"
    ) {
      return res
        .status(403)
        .json({
          code:
            "ACCOUNT_PENDING",

          message:
            "Your account is waiting for administrator approval.",
        });
    }

    if (
      user.approvalStatus ===
      "rejected"
    ) {
      return res
        .status(403)
        .json({
          code:
            "ACCOUNT_REJECTED",

          message:
            "Your access request was not approved. Please contact the administrator.",
        });
    }

    return res.json({
      token:
        signToken(
          user.id
        ),

      user: {
        id:
          user.id,

        name:
          user.name,

        employeeId:
          user.employeeId,

        email:
          user.email,

        phone:
          user.phone,

        department:
          user.department,

        profilePicture:
          user.profilePicture,

        leaveBalance:
          user.leaveBalance,

        role:
          user.role,

        approvalStatus:
          user.approvalStatus,
      },
    });
  }
);

/* =========================================================
   FORGOT PASSWORD
========================================================= */

authRouter.post(
  "/forgot-password",
  async (req, res) => {
    const input = z
      .object({
        email: z
          .string()
          .email(
            "Enter a valid email address"
          ),
      })
      .parse(req.body);

    const email =
      input.email
        .trim()
        .toLowerCase();

    const genericResponse = {
      message:
        "If an approved account exists for this email address, password reset instructions have been sent.",
    };

    const user =
      await User.findOne({
        email,
      });

    if (
      !user ||
      user.approvalStatus !==
        "approved"
    ) {
      return res.json(
        genericResponse
      );
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const resetTokenHash =
      crypto
        .createHash(
          "sha256"
        )
        .update(
          resetToken
        )
        .digest("hex");

    const expiresAt =
      new Date(
        Date.now() +
          15 *
            60 *
            1000
      );

    user.set(
      "passwordResetTokenHash",
      resetTokenHash
    );

    user.set(
      "passwordResetExpiresAt",
      expiresAt
    );

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:8081";

    const resetLink =
      `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(
        user.email,
        user.name,
        resetLink
      );
    } catch (error) {
      console.error(
        "Password reset email error:",
        error
      );

      user.set(
        "passwordResetTokenHash",
        null
      );

      user.set(
        "passwordResetExpiresAt",
        null
      );

      await user.save();

      return res
        .status(500)
        .json({
          message:
            "Unable to send password reset email. Please try again later.",
        });
    }

    return res.json(
      genericResponse
    );
  }
);

/* =========================================================
   RESET PASSWORD
========================================================= */

authRouter.post(
  "/reset-password",
  async (req, res) => {
    const input = z
      .object({
        token: z
          .string()
          .min(
            1,
            "Reset token is required"
          ),

        password: z
          .string()
          .min(
            8,
            "Password must contain at least 8 characters"
          ),
      })
      .parse(req.body);

    const tokenHash =
      crypto
        .createHash(
          "sha256"
        )
        .update(
          input.token
        )
        .digest("hex");

    const user =
      await User.findOne({
        passwordResetTokenHash:
          tokenHash,

        passwordResetExpiresAt: {
          $gt:
            new Date(),
        },

        approvalStatus:
          "approved",
      });

    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "This password reset link is invalid or has expired. Please request a new one.",
        });
    }

    const passwordHash =
      await bcrypt.hash(
        input.password,
        12
      );

    user.passwordHash =
      passwordHash;

    user.set(
      "passwordResetTokenHash",
      null
    );

    user.set(
      "passwordResetExpiresAt",
      null
    );

    await user.save();

    return res.json({
      message:
        "Your password has been reset successfully. You can now sign in with your new password.",
    });
  }
);