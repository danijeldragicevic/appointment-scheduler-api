import { Router } from "express";
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "../controllers/services.controller";

const router = Router();

router.get("/", listServices);
router.post("/", createService);
router.get("/:id", getService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
