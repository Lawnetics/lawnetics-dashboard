import express from "express";
import multer from "multer";
import {
    getDocuments,
    createDocument,
    uploadDocument,
    pushToDrive,
    deleteDocument
} from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getDocuments);
router.post("/", createDocument);
router.post("/upload", upload.single("file"), uploadDocument);
router.post("/push-to-drive", pushToDrive);
router.delete("/:id", deleteDocument);

export default router;
