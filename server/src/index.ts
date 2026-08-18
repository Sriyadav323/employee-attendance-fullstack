import "dotenv/config";

import { app } from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = Number(
  process.env.PORT || 5001
);

async function start() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(
        `API listening on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

start();