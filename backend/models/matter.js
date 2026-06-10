import mongoose from "mongoose";

const matterSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        type: {
            type: String,
            required: true,
            enum: ['TM', 'PAT', 'COPY', 'DESIGN', 'GI', 'HC', 'DC'],
        },
        clientId: {
            type: String,
            required: true,
        },
        clientName: {
            type: String,
            required: true,
        },
        // For TM, PAT, COPY, DESIGN, GI
        appNo: { type: String },
        mark: { type: String }, // Used as trademark mark, patent title, GI name, copyright title, design name
        classes: { type: String }, // For TM
        markType: { type: String }, // For TM
        priorityDate: { type: String }, // For TM
        nature: { type: String }, // For COPY
        author: { type: String }, // For COPY
        registrationDate: { type: String }, // For COPY
        goods: { type: String }, // For GI
        area: { type: String }, // For GI
        giClass: { type: String }, // For GI
        designClass: { type: String }, // For DESIGN
        locarnoClass: { type: String }, // For DESIGN
        inventors: { type: String }, // For PAT
        patentType: { type: String }, // For PAT
        field: { type: String }, // For PAT
        status: { type: String }, // For IP types
        
        // For HC, DC (Court cases)
        caseNo: { type: String },
        caseTitle: { type: String },
        court: { type: String },
        bench: { type: String },
        stage: { type: String }, // Stage of case (like Arguments, Evidence, Summons)
        caseType: { type: String }, // Type of court case (Writ, Appeal, Civil Suit, etc.)

        // Common Fields
        filingDate: { type: String },
        nextDate: { type: String },
        priority: {
            type: String,
            enum: ['h', 'm', 'l', 'ug', 'wa', 'ok', ''],
            default: 'm',
        },
        attorney: {
            type: String,
            default: 'Self',
        },
        notes: { type: String, default: '' },
        created: { type: String }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export default mongoose.models.Matter || mongoose.model("Matter", matterSchema);
