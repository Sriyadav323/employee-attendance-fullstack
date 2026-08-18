import type { Request, Response } from "express";

import { app } from "../src/app.js";
import { connectDb } from "../src/config/db.js";

let connection: Promise<void> | undefined;

export default async function handler(req: Request, res: Response) {
  connection ??= connectDb();
  await connection;

  return app(req, res);
}
