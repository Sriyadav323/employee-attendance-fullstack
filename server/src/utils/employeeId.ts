import crypto from "node:crypto";

import { User } from "../models/User.js";

export async function generateUniqueEmployeeId() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const employeeId = `EMP-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    const exists = await User.exists({ employeeId });

    if (!exists) {
      return employeeId;
    }
  }

  throw new Error(
    "Unable to generate a unique Employee ID"
  );
}
