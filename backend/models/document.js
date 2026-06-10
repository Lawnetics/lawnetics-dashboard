import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: {
            type: String,
            required: true,
        },
        matterId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'pdf',
        },
        size: {
            type: String,
            default: '0.0 MB',
        },
        tags: {
            type: [String],
            default: [],
        },
        date: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export default mongoose.models.Document || mongoose.model("Document", documentSchema);
