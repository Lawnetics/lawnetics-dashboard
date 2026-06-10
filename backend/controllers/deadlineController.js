import Deadline from "../models/deadline.js";

// Get all deadlines
export const getDeadlines = async (req, res) => {
    try {
        const deadlines = await Deadline.find({}).sort({ date: 1 });
        res.json(deadlines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create deadline
export const createDeadline = async (req, res) => {
    try {
        const deadline = new Deadline(req.body);
        const createdDeadline = await deadline.save();
        res.status(201).json(createdDeadline);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete deadline
export const deleteDeadline = async (req, res) => {
    try {
        const deadline = await Deadline.findById(req.params.id);
        if (deadline) {
            await deadline.deleteOne();
            res.json({ message: "Deadline removed" });
        } else {
            res.status(404).json({ message: "Deadline not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
