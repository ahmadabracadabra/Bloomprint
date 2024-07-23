import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPlant, getPlants, createPlant, deletePlant, updatePlant } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ["GET"],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.use(express.json());

app.get("/Native_Plant_List", async (req, res) => {
    const plants = await getPlants();
    res.send(plants);
});

app.get("/Native_Plant_List/:id", async (req, res) => {
    const id = req.params.id;
    const plant = await getPlant(id);
    res.send(plant);
});

app.post("/Native_Plant_List", async (req, res) => {
    const { Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, 
        Bloom_end, Hardiness_zone, Soil_moisture } = req.body;
    const plant = await createPlant(Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, 
        Bloom_end, Hardiness_zone, Soil_moisture);
    res.status(201).send(plant);
});

app.delete("/Native_Plant_List/:id", async (req, res) => {
    const id = req.params.id;
    const success = await deletePlant(id);
    if (success) {
        res.send({ message: 'Plant deleted successfully' });
    } else {
        res.status(404).send({ error: 'Plant not found' });
    }
});

app.put("/Native_Plant_List/:id", async (req, res) => {
    const id = req.params.id;
    const { Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, 
        Bloom_end, Hardiness_zone, Soil_moisture } = req.body;
    const plant = await updatePlant(id, Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, 
        Bloom_end, Hardiness_zone, Soil_moisture);
    if (plant) {
        res.send(plant);
    } else {
        res.status(404).send({ error: 'Plant not found' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
