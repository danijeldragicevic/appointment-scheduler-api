import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from "../controllers/appointments.controller";

const router = Router();

router.get("/", listAppointments);
router.post("/", createAppointment);
router.get("/:id", getAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", cancelAppointment);

export default router;
