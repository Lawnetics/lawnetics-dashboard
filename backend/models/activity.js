import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        text: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            default: 'Just now',
        },
        color: {
            type: String,
            default: 'navy',
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export default mongoose.models.Activity || mongoose.model("Activity", activitySchema);
