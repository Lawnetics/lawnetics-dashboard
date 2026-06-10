import express from "express";
import {
    getMatters,
    createMatter,
    updateMatter,
    deleteMatter
} from "../controllers/matterController.js";

const router = express.Router();

router.get("/", getMatters);
router.post("/", createMatter);
router.put("/:id", updateMatter);
router.delete("/:id", deleteMatter);

export default router;
