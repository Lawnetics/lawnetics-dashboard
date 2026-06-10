import { google } from "googleapis";

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

let driveClient = null;

if (clientId && clientSecret && refreshToken) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        driveClient = google.drive({ version: "v3", auth: oauth2Client });
        console.log("Google Drive client initialized successfully using OAuth2 User Account.");
    } catch (err) {
        console.error("Error initializing Google Drive client via OAuth2:", err.message);
    }
} else if (email && key) {
    try {
        let cleanKey = key.trim();
        if (cleanKey.startsWith('"')) {
            cleanKey = cleanKey.slice(1);
        }
        if (cleanKey.endsWith('"')) {
            cleanKey = cleanKey.slice(0, -1);
        }
        cleanKey = cleanKey.replace(/\\n/g, "\n");

        // Robust PEM extraction: get everything between BEGIN and END tags
        const pemMatch = cleanKey.match(/-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/);
        if (pemMatch) {
            cleanKey = pemMatch[0];
        }

        const auth = new google.auth.JWT({
            email: email,
            key: cleanKey,
            scopes: ["https://www.googleapis.com/auth/drive"]
        });
        driveClient = google.drive({ version: "v3", auth });
        console.log("Google Drive client initialized successfully using Service Account (JWT).");
    } catch (err) {
        console.error("Error initializing Google Drive client via Service Account:", err.message);
    }
} else {
    console.log("Google Drive credentials not configured. Using local fallback.");
}

export { driveClient, parentFolderId };
