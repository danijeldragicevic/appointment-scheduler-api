import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config({ path: "dev.env" });

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Appointment Scheduler API listening on http://localhost:${PORT}`);
});
