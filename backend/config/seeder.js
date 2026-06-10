import mongoose from "mongoose";
import Client from "../models/client.js";
import Matter from "../models/matter.js";
import Deadline from "../models/deadline.js";
import Document from "../models/document.js";
import Activity from "../models/activity.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Helper functions for dynamic relative dates
const td = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
};

const tp = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

const MOCK_CLIENTS = [
    { _id: 'c1', name: 'ABC Pvt. Ltd.', type: 'Company', country: 'India', contact: 'Ramesh Gupta', email: 'legal@abc.com', phone: '+91 98100 11111', attorney: 'Self', created: '2024-01-15' },
    { _id: 'c2', name: 'XYZ Technologies', type: 'Company', country: 'India', contact: 'Priya Singh', email: 'ip@xyz.tech', phone: '+91 98200 22222', attorney: 'Self', created: '2024-03-10' },
    { _id: 'c3', name: 'Global Foods Inc.', type: 'Company', country: 'USA', contact: 'John Smith', email: 'legal@globalfoods.com', phone: '+1 646 000 0001', attorney: 'Adv. P. Sharma', created: '2024-06-22' },
    { _id: 'c4', name: 'Dr. Priya Mehta', type: 'Individual', country: 'India', contact: 'Dr. Priya Mehta', email: 'priya@gmail.com', phone: '+91 97100 33333', attorney: 'Adv. R. Verma', created: '2025-01-05' },
    { _id: 'c5', name: 'Darjeeling Tea Board', type: 'Statutory Body', country: 'India', contact: 'Secretary', email: 'info@darjeelingtea.in', phone: '+91 354 000 000', attorney: 'Self', created: '2025-03-12' },
];

const MOCK_MATTERS = [
    { _id: 'm1', type: 'TM', clientId: 'c1', clientName: 'ABC Pvt. Ltd.', appNo: '5896321', mark: 'ZENOVA', classes: '35', filingDate: '2023-08-15', status: 'Under Examination', nextDate: td(12), priority: 'h', attorney: 'Self', notes: 'FER received. Reply due urgently.', created: tp(30) },
    { _id: 'm2', type: 'TM', clientId: 'c1', clientName: 'ABC Pvt. Ltd.', appNo: '5897854', mark: 'ZENOVA PLUS', classes: '42', filingDate: '2023-09-20', status: 'Pending', nextDate: td(45), priority: 'm', attorney: 'Self', notes: '', created: tp(25) },
    { _id: 'm3', type: 'TM', clientId: 'c2', clientName: 'XYZ Technologies', appNo: '6012345', mark: 'XYTRON', classes: '9,42', filingDate: '2024-01-10', status: 'Hearing Fixed', nextDate: td(7), priority: 'h', attorney: 'Self', notes: 'Hearing at IPO Mumbai.', created: tp(20) },
    { _id: 'm4', type: 'PAT', clientId: 'c2', clientName: 'XYZ Technologies', appNo: 'IN202441002234', mark: 'Smart IoT Gateway System', filingDate: '2024-02-28', status: 'Pending', nextDate: td(60), priority: 'm', attorney: 'Adv. P. Sharma', inventors: 'Priya Singh, Rahul Verma', notes: 'PCT application filed.', created: tp(18) },
    { _id: 'm5', type: 'TM', clientId: 'c3', clientName: 'Global Foods Inc.', appNo: '6234567', mark: 'TASTYMAX', classes: '30', filingDate: '2024-05-01', status: 'Opposed', nextDate: td(22), priority: 'h', attorney: 'Adv. P. Sharma', notes: 'Opposition by competitor.', created: tp(15) },
    { _id: 'm6', type: 'COPY', clientId: 'c4', clientName: 'Dr. Priya Mehta', appNo: 'SW/2025/00456', mark: 'Research Publication Vol 3', nature: 'Literary', filingDate: '2025-02-01', status: 'Registered', nextDate: '', priority: 'l', attorney: 'Adv. R. Verma', notes: '', created: tp(12) },
    { _id: 'm7', type: 'GI', clientId: 'c5', clientName: 'Darjeeling Tea Board', appNo: 'GI/1/2006/00045', mark: 'Darjeeling Tea', goods: 'Tea', area: 'Darjeeling, West Bengal', filingDate: '2006-04-27', status: 'Registered', nextDate: td(90), priority: 'l', attorney: 'Self', notes: "World's first GI tag in India.", created: tp(10) },
    { _id: 'm8', type: 'HC', clientId: 'c2', clientName: 'XYZ Technologies', caseNo: 'W.P.(C) 1234/2025', caseTitle: 'XYZ Technologies vs ABC Corp', court: 'Delhi High Court', bench: 'Division Bench', filingDate: '2025-03-10', nextDate: td(20), stage: 'Arguments', attorney: 'Self', notes: '', created: tp(8) },
    { _id: 'm9', type: 'DC', clientId: 'c3', clientName: 'Global Foods Inc.', caseNo: 'CS(OS) 567/2025', caseTitle: 'Global Foods vs Rival Brands', court: 'Saket District Court', filingDate: '2025-04-15', nextDate: td(15), stage: 'Evidence', attorney: 'Adv. P. Sharma', notes: '', created: tp(5) },
    { _id: 'm10', type: 'DESIGN', clientId: 'c1', clientName: 'ABC Pvt. Ltd.', appNo: 'D/2025/12345', mark: 'Premium Packaging', designClass: '09-03', filingDate: '2025-05-01', status: 'Pending', nextDate: td(35), priority: 'm', attorney: 'Self', notes: '', created: tp(3) },
];

const MOCK_DEADLINES = [
    { _id: 'd1', type: 'Hearing', matterId: 'm3', matterName: 'XYTRON (XYZ Tech)', date: td(7), time: '10:30', venue: 'IPO Mumbai', priority: 'ug', attorney: 'Self', notes: 'Officer: Mr. J. Iyer' },
    { _id: 'd2', type: 'FER Deadline', matterId: 'm1', matterName: 'ZENOVA (ABC Pvt.)', date: td(12), time: '', venue: '', priority: 'ug', attorney: 'Self', notes: 'Reply to FER due' },
    { _id: 'd3', type: 'Opposition Deadline', matterId: 'm5', matterName: 'TASTYMAX (Global Foods)', date: td(22), time: '', venue: '', priority: 'wa', attorney: 'Adv. P. Sharma', notes: 'Evidence affidavit due' },
    { _id: 'd4', type: 'Court Date', matterId: 'm9', matterName: 'CS(OS) 567/2025', date: td(15), time: '11:00', venue: 'Saket District Court', priority: 'wa', attorney: 'Adv. P. Sharma', notes: 'Evidence stage' },
    { _id: 'd5', type: 'Hearing', matterId: 'm8', matterName: 'W.P.(C) 1234/2025', date: td(20), time: '10:30', venue: 'Delhi High Court', priority: 'wa', attorney: 'Self', notes: '' },
    { _id: 'd6', type: 'Renewal Due', matterId: 'm7', matterName: 'Darjeeling Tea GI', date: td(90), time: '', venue: '', priority: 'ok', attorney: 'Self', notes: '10-year renewal' },
];

const MOCK_DOCUMENTS = [
    { _id: 'f1', name: 'ZENOVA_FER_Receipt.pdf', matterId: 'm1', type: 'pdf', size: '1.2 MB', date: tp(2), tags: ['FER', 'Official'], url: 'http://localhost:5000/uploads/ZENOVA_FER_Receipt.pdf' },
    { _id: 'f2', name: 'XYTRON_Hearing_Notice.pdf', matterId: 'm3', type: 'pdf', size: '0.8 MB', date: tp(1), tags: ['Hearing', 'Urgent'], url: 'http://localhost:5000/uploads/XYTRON_Hearing_Notice.pdf' },
    { _id: 'f3', name: 'TASTYMAX_Opposition.pdf', matterId: 'm5', type: 'pdf', size: '2.1 MB', date: tp(5), tags: ['Opposition'], url: 'http://localhost:5000/uploads/TASTYMAX_Opposition.pdf' },
    { _id: 'f4', name: 'GI_Darjeeling_Certificate.pdf', matterId: 'm7', type: 'pdf', size: '3.5 MB', date: tp(30), tags: ['Certificate'], url: 'http://localhost:5000/uploads/GI_Darjeeling_Certificate.pdf' },
    { _id: 'f5', name: 'HC_Writ_Petition.docx', matterId: 'm8', type: 'doc', size: '1.8 MB', date: tp(8), tags: ['Pleadings', 'Court'], url: 'http://localhost:5000/uploads/HC_Writ_Petition.docx' },
];

const MOCK_ACTIVITY = [
    { _id: 'a1', text: '<strong>FER received</strong> for ZENOVA (App 5896321)', time: '2h ago', color: 'org' },
    { _id: 'a2', text: '<strong>Hearing fixed</strong> for XYTRON', time: '4h ago', color: 'cyan' },
    { _id: 'a3', text: '<strong>New matter:</strong> Darjeeling Tea GI', time: 'Yesterday', color: 'green' },
    { _id: 'a4', text: '<strong>Document uploaded:</strong> HC Writ Petition', time: '2 days ago', color: 'gold' },
    { _id: 'a5', text: '<strong>Google Drive synced</strong> — 5 files updated', time: '3 days ago', color: 'navy' },
];

export const seedDatabase = async () => {
    try {
        // Sync Admin Credentials
        const adminEmail = process.env.ADMIN_EMAIL || "admin@lawnetics.in";
        const adminPassword = process.env.ADMIN_PASSWORD || "lawnetics";

        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            console.log("Creating default admin user...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: "Admin",
                email: adminEmail,
                password: hashedPassword
            });
            console.log("Admin user created successfully.");
        } else {
            // Check if password has changed in .env compared to DB
            const isMatch = await bcrypt.compare(adminPassword, admin.password);
            if (!isMatch) {
                console.log("Admin password change detected in .env. Syncing hash to database...");
                admin.password = await bcrypt.hash(adminPassword, 10);
                await admin.save();
                console.log("Admin password updated successfully.");
            }
        }

        // Seeding Clients
        const clientCount = await Client.countDocuments();
        if (clientCount === 0) {
            console.log("Seeding clients database...");
            await Client.insertMany(MOCK_CLIENTS);
            console.log(`Seeded ${MOCK_CLIENTS.length} clients.`);
        }

        // Seeding Matters
        const matterCount = await Matter.countDocuments();
        if (matterCount === 0) {
            console.log("Seeding matters database...");
            await Matter.insertMany(MOCK_MATTERS);
            console.log(`Seeded ${MOCK_MATTERS.length} matters.`);
        }

        // Seeding Deadlines
        const deadlineCount = await Deadline.countDocuments();
        if (deadlineCount === 0) {
            console.log("Seeding deadlines database...");
            await Deadline.insertMany(MOCK_DEADLINES);
            console.log(`Seeded ${MOCK_DEADLINES.length} deadlines.`);
        }

        // Seeding Documents
        const documentCount = await Document.countDocuments();
        if (documentCount === 0) {
            console.log("Seeding documents database...");
            await Document.insertMany(MOCK_DOCUMENTS);
            console.log(`Seeded ${MOCK_DOCUMENTS.length} documents.`);
        }

        // Seeding Activities
        const activityCount = await Activity.countDocuments();
        if (activityCount === 0) {
            console.log("Seeding activities database...");
            await Activity.insertMany(MOCK_ACTIVITY);
            console.log(`Seeded ${MOCK_ACTIVITY.length} activities.`);
        }

        console.log("Database check and seeding complete.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
