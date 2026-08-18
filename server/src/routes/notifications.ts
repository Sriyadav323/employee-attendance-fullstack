import { Router } from "express";

import { Attendance } from "../models/Attendance.js";
import { Notification } from "../models/Notification.js";
import { dateKey } from "../utils/date.js";
import { notify } from "../utils/notifications.js";

export const notificationRouter = Router();

notificationRouter.get("/", async (req, res) => {
  const day = dateKey();
  const attendance = await Attendance.findOne({ userId: req.userId, attendanceDate: day });

  if (!attendance?.checkInAt) {
    await notify({
      userId: req.userId,
      type: "attendance",
      title: "Check-in reminder",
      message: "Remember to check in when you begin your workday.",
      key: `${req.userId}:${day}:check-in`,
    });
  } else if (!attendance.checkOutAt) {
    await notify({
      userId: req.userId,
      type: "attendance",
      title: "Check-out reminder",
      message: "You are checked in. Remember to check out when your workday ends.",
      key: `${req.userId}:${day}:check-out`,
    });
  }

  const items = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(100);
  const unreadCount = await Notification.countDocuments({ userId: req.userId, readAt: null });
  return res.json({ items, unreadCount });
});

notificationRouter.patch("/:id/read", async (req, res) => {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Notification not found" });
  return res.json(item);
});

notificationRouter.patch("/read-all", async (req, res) => {
  await Notification.updateMany({ userId: req.userId, readAt: null }, { $set: { readAt: new Date() } });
  return res.json({ message: "All notifications marked as read" });
});
