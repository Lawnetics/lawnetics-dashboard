import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        type: {
            type: String,
            required: true,
        },
        matterId: {
            type: String,
            required: true,
        },
        matterName: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            default: '',
        },
        venue: {
            type: String,
            default: '',
        },
        priority: {
            type: String,
            enum: ['ug', 'wa', 'ok'],
            default: 'wa',
        },
        attorney: {
            type: String,
            default: 'Self',
        },
        notes: {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export default mongoose.models.Deadline || mongoose.model("Deadline", deadlineSchema);
