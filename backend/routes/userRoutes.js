import express from "express";
const router = express.Router();


import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
} from "../controllers/userController.js";

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;