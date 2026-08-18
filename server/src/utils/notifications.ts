import { Notification } from "../models/Notification.js";

export async function notify(input: {
  userId: unknown;
  type: "account" | "attendance" | "correction" | "leave" | "system";
  title: string;
  message: string;
  key?: string;
}) {
  try {
    return await Notification.create(input);
  } catch (error: any) {
    if (error?.code === 11000) return null;
    throw error;
  }
}
