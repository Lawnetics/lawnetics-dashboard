import Client from "../models/client.js";

// Get all clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find({}).sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create client
export const createClient = async (req, res) => {
    try {
        const client = new Client(req.body);
        const createdClient = await client.save();
        res.status(201).json(createdClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update client
export const updateClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            Object.assign(client, req.body);
            const updatedClient = await client.save();
            res.json(updatedClient);
        } else {
            res.status(404).json({ message: "Client not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete client
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            await client.deleteOne();
            res.json({ message: "Client removed" });
        } else {
            res.status(404).json({ message: "Client not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
