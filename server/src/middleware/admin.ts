import {
  NextFunction,
  Request,
  Response,
} from "express";

import { User } from "../models/User.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Authentication required",
        });
    }

    if (
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          message:
            "Administrator access required",
        });
    }

    next();
  } catch {
    return res
      .status(500)
      .json({
        message:
          "Unable to verify administrator access",
      });
  }
}