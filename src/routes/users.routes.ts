import { Router } from "express";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "../controllers/users.controller";

const router = Router();

router.get("/", listUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
