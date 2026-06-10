import Matter from "../models/matter.js";

// Get all matters
export const getMatters = async (req, res) => {
    try {
        const matters = await Matter.find({}).sort({ createdAt: -1 });
        res.json(matters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create matter
export const createMatter = async (req, res) => {
    try {
        const matter = new Matter(req.body);
        const createdMatter = await matter.save();
        res.status(201).json(createdMatter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update matter
export const updateMatter = async (req, res) => {
    try {
        const matter = await Matter.findById(req.params.id);
        if (matter) {
            Object.assign(matter, req.body);
            const updatedMatter = await matter.save();
            res.json(updatedMatter);
        } else {
            res.status(404).json({ message: "Matter not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete matter
export const deleteMatter = async (req, res) => {
    try {
        const matter = await Matter.findById(req.params.id);
        if (matter) {
            await matter.deleteOne();
            res.json({ message: "Matter removed" });
        } else {
            res.status(404).json({ message: "Matter not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
