import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";

export const profileRouter = Router();

const phoneSchema = z
  .string()
  .trim()
  .max(20)
  .refine(
    (value) => !value || /^\+?[0-9()\-\s]{7,20}$/.test(value),
    "Enter a valid phone number"
  );

const pictureSchema = z
  .string()
  .max(2_000_000, "Profile picture is too large")
  .refine(
    (value) =>
      !value ||
      /^https?:\/\//i.test(value) ||
      /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value),
    "Choose a valid image or enter an HTTPS image URL"
  );

profileRouter.get("/", async (req, res) => {
  const user = await User.findById(req.userId).select(
    "-passwordHash -passwordResetTokenHash"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});

profileRouter.patch("/", async (req, res) => {
  const input = z
    .object({
      phone: phoneSchema.optional(),
      profilePicture: pictureSchema.optional(),
    })
    .parse(req.body);

  const user = await User.findByIdAndUpdate(req.userId, input, {
    new: true,
    runValidators: true,
  }).select("-passwordHash -passwordResetTokenHash");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});
