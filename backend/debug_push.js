import "dotenv/config";
import mongoose from "mongoose";
import Document from "./models/document.js";
import { driveClient, parentFolderId } from "./config/driveService.js";
import path from "path";
import fs from "fs";
import stream from "stream";

const MONGO_URI = process.env.MONGO_URI;

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        console.log("Drive Client Initialized:", !!driveClient);

        const documents = await Document.find({});
        console.log(`Total documents found in database: ${documents.length}`);

        const localDocs = documents.filter(doc => doc.url && doc.url.includes("/uploads/"));
        console.log(`Local documents to sync: ${localDocs.length}`);
        
        const uploadsDir = path.join(process.cwd(), "uploads");
        console.log("Uploads Directory:", uploadsDir);

        for (const doc of localDocs) {
            console.log(`\nChecking doc: ${doc.name}`);
            const fileName = doc.url.split("/uploads/").pop();
            const filePath = path.join(uploadsDir, fileName);
            const exists = fs.existsSync(filePath);
            console.log(`File: ${fileName}, Exists on disk: ${exists}`);

            if (!exists) continue;

            if (!driveClient) {
                console.log("Drive client not initialized. Skipping upload.");
                continue;
            }

            try {
                console.log("Attempting upload to Drive...");
                const fileMetadata = {
                    name: doc.name,
                    parents: parentFolderId ? [parentFolderId] : [],
                };

                const fileStream = fs.createReadStream(filePath);
                
                let mimeType = "application/octet-stream";
                if (doc.type === "pdf") mimeType = "application/pdf";
                else if (doc.type === "doc" || doc.type === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                const media = {
                    mimeType: mimeType,
                    body: fileStream,
                };

                const driveResponse = await driveClient.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: "id, webViewLink",
                    supportsAllDrives: true,
                });

                console.log("Drive Upload Success! Link:", driveResponse.data.webViewLink);
            } catch (err) {
                console.error("Upload Error for doc:", doc.name, "-", err.message);
            }
        }

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
