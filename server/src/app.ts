import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ZodError } from "zod";

import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { attendanceRouter } from "./routes/attendance.js";
import { leaveRouter } from "./routes/leaves.js";
import { profileRouter } from "./routes/profile.js";
import { adminRouter } from "./routes/admin.js";

import { errorHandler } from "./middleware/error.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_q, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use(
  "/api/dashboard",
  requireAuth,
  dashboardRouter
);

app.use(
  "/api/attendance",
  requireAuth,
  attendanceRouter
);

app.use(
  "/api/leaves",
  requireAuth,
  leaveRouter
);

app.use(
  "/api/profile",
  requireAuth,
  profileRouter
);

app.use(
  "/api/admin",
  requireAuth,
  adminRouter
);

app.use(
  (err: any, req: any, res: any, next: any) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        issues: err.issues,
      });
    }

    return errorHandler(
      err,
      req,
      res,
      next
    );
  }
);