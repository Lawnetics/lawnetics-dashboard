import Activity from "../models/activity.js";

// Get all activities (limit to top 20/50 for dashboard performance)
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(20);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create activity
export const createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
