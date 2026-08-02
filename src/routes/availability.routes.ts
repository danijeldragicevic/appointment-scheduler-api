import { Router } from "express";
import { listAvailability } from "../controllers/availability.controller";

const router = Router();

router.get("/", listAvailability);

export default router;
