import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Company', 'Individual', 'LLP', 'Partnership', 'Trust', 'Statutory Body', 'Other'],
        },
        country: {
            type: String,
            default: 'India',
        },
        contact: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        attorney: {
            type: String,
            default: 'Self',
        },
        created: {
            type: String, // Storing as string or date, let's store as string for simplicity to match frontend 'YYYY-MM-DD'
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export default mongoose.models.Client || mongoose.model("Client", clientSchema);
