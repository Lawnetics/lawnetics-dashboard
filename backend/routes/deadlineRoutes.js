import express from "express";
import {
    getDeadlines,
    createDeadline,
    deleteDeadline
} from "../controllers/deadlineController.js";

const router = express.Router();

router.get("/", getDeadlines);
router.post("/", createDeadline);
router.delete("/:id", deleteDeadline);

export default router;
