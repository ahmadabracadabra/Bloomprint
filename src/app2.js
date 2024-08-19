import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMessage, getMessages, createMessage, deleteMessage, updateMessage } from './database2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'https://bloomprint.xyz',
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

// Define the visitor_log routes
app.get("/visitor_log", async (req, res) => {
    try {
        const messages = await getMessages();
        res.json(messages);
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
            res.json(message);
        } else {
            res.status(404).send({ error: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/visitor_log', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received POST request:', req.body);
    try {
        const newMessage = await createMessage(name, email, message);
        console.log('Created new message:', newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).send(error.message);
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
            res.json(updatedMessage);
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
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
