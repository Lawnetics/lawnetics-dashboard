import Document from "../models/document.js";
import { driveClient, parentFolderId } from "../config/driveService.js";
import path from "path";
import fs from "fs";
import stream from "stream";

// Get all documents
export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({}).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create document
export const createDocument = async (req, res) => {
    try {
        const document = new Document(req.body);
        const createdDocument = await document.save();
        res.status(201).json(createdDocument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Upload document (Google Drive with Local Fallback)
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const originalName = req.file.originalname;
        const fileType = originalName.split('.').pop().toLowerCase();
        const fileSize = (req.file.size / 1048576).toFixed(1) + " MB";
        const matterId = req.body.matterId || "";
        const tags = req.body.tags ? JSON.parse(req.body.tags) : ["Uploaded"];

        let fileUrl = "";

        if (driveClient) {
            // Google Drive Upload
            console.log(`Uploading "${originalName}" to Google Drive...`);
            const fileMetadata = {
                name: originalName,
                parents: parentFolderId ? [parentFolderId] : [],
            };

            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            const media = {
                mimeType: req.file.mimetype,
                body: bufferStream,
            };

            const driveResponse = await driveClient.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id, webViewLink",
                supportsAllDrives: true,
            });

            fileUrl = driveResponse.data.webViewLink;
            console.log(`Google Drive upload successful. Link: ${fileUrl}`);
        } else {
            // Local Fallback Upload
            console.log(`Google Drive not configured. Uploading "${originalName}" locally...`);
            
            // Deduplicate filename to prevent overwrite
            const fileExt = path.extname(originalName);
            const baseName = path.basename(originalName, fileExt);
            let uniqueName = originalName;
            let counter = 1;
            const uploadsDir = path.join(process.cwd(), "uploads");

            while (fs.existsSync(path.join(uploadsDir, uniqueName))) {
                uniqueName = `${baseName}_${counter}${fileExt}`;
                counter++;
            }

            const filePath = path.join(uploadsDir, uniqueName);
            await fs.promises.writeFile(filePath, req.file.buffer);

            // Construct local asset URL
            const host = req.get("host") || "localhost:5000";
            const protocol = req.protocol || "http";
            fileUrl = `${protocol}://${host}/uploads/${uniqueName}`;
            console.log(`Local upload successful. URL: ${fileUrl}`);
        }

        // Save to MongoDB
        const document = new Document({
            name: originalName,
            matterId: matterId,
            type: fileType,
            size: fileSize,
            date: new Date().toISOString().split("T")[0],
            tags: tags,
            url: fileUrl,
        });

        const createdDocument = await document.save();
        res.status(201).json(createdDocument);
    } catch (error) {
        console.error("Document upload error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete document
export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (document) {
            // If it's a local file, we can optionally delete it from the disk
            if (document.url && document.url.includes("/uploads/")) {
                try {
                    const fileName = document.url.split("/uploads/").pop();
                    const filePath = path.join(process.cwd(), "uploads", fileName);
                    if (fs.existsSync(filePath)) {
                        await fs.promises.unlink(filePath);
                        console.log(`Deleted local file: ${filePath}`);
                    }
                } catch (err) {
                    console.error("Error deleting local file:", err.message);
                }
            }
            
            await document.deleteOne();
            res.json({ message: "Document removed" });
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Push all local documents to Google Drive
export const pushToDrive = async (req, res) => {
    try {
        if (!driveClient) {
            return res.status(400).json({ message: "Google Drive is not configured. Please enable and verify your Service Account credentials in the backend environment." });
        }

        // Fetch all documents from database
        const documents = await Document.find({});
        
        // Filter for local documents (having a url pointing to local uploads)
        const localDocs = documents.filter(doc => doc.url && doc.url.includes("/uploads/"));
        
        if (localDocs.length === 0) {
            return res.json({ message: "All documents are already synced with Google Drive.", count: 0 });
        }

        let successCount = 0;
        const uploadsDir = path.join(process.cwd(), "uploads");

        for (const doc of localDocs) {
            try {
                // Parse filename from URL
                const fileName = doc.url.split("/uploads/").pop();
                const filePath = path.join(uploadsDir, fileName);

                if (!fs.existsSync(filePath)) {
                    console.log(`Local file not found for document: ${doc.name} (${filePath})`);
                    continue;
                }

                console.log(`Pushing "${doc.name}" to Google Drive...`);

                const fileMetadata = {
                    name: doc.name,
                    parents: parentFolderId ? [parentFolderId] : [],
                };

                const fileStream = fs.createReadStream(filePath);
                
                // Deduce mimetype simple mapping
                let mimeType = "application/octet-stream";
                if (doc.type === "pdf") mimeType = "application/pdf";
                else if (doc.type === "doc" || doc.type === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                else if (doc.type === "png") mimeType = "image/png";
                else if (doc.type === "jpg" || doc.type === "jpeg") mimeType = "image/jpeg";

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

                const driveUrl = driveResponse.data.webViewLink;
                console.log(`Pushed successfully! Drive URL: ${driveUrl}`);

                // Update document url in MongoDB
                doc.url = driveUrl;
                doc.tags = [...new Set([...doc.tags, "Synced"])];
                await doc.save();

                // Clean up local file to free disk space
                try {
                    await fs.promises.unlink(filePath);
                    console.log(`Deleted local file after sync: ${filePath}`);
                } catch (unlinkErr) {
                    console.error(`Failed to delete local file: ${unlinkErr.message}`);
                }

                successCount++;
            } catch (docErr) {
                console.error(`Error pushing document "${doc.name}":`, docErr.message);
            }
        }

        res.json({
            message: `Successfully pushed ${successCount} documents to Google Drive.`,
            count: successCount
        });
    } catch (error) {
        console.error("Push to Drive general error:", error);
        res.status(500).json({ message: error.message });
    }
};
