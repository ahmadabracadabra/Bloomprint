import express from 'express';
import cors from 'cors';

import { getMessage, getMessages, createMessage, deleteMessage, updateMessage } from './database2.js';

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use(express.static('public'));

app.get("/visitor_log", async (req, res) => {
    try {
        const messages = await getMessages();
        res.send(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get("/visitor_log/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const message = await getMessage(id);
        if (message) {
            res.send(message);
        } else {
            res.status(404).send({ error: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post("/visitor_log", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = await createMessage(name, email, message);
        res.status(201).send(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete("/visitor_log/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const success = await deleteMessage(id);
        if (success) {
            res.send({ message: 'Message deleted successfully' });
        } else {
            res.status(404).send({ error: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.put("/visitor_log/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, message } = req.body;
        const updatedMessage = await updateMessage(id, name, email, message);
        if (updatedMessage) {
            res.send(updatedMessage);
        } else {
            res.status(404).send({ error: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!2');
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
