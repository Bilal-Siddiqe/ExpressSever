const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error("❌ Database Not Connected", error));
db.once('open', () => console.log('✅ Database Connected'));

// Mongoose Schema & Model
const dataSchema = new mongoose.Schema({
    name: { required: true, type: String },
    age: { required: true, type: String },
});
const Model = mongoose.model('Data', dataSchema);

// ➕ Create (POST)
app.post('/', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age,
    });
    try {
        const savedData = await data.save();
        res.status(200).json(savedData);
    } catch (error) {
        res.status(400).json({ message: "❌ Bhai Data Save Nai Ho Raha", error });
    }
});

// 📥 Read All (GET)
app.get('/', async (req, res) => {
    try {
        const allData = await Model.find();
        res.status(200).json(allData);
    } catch (error) {
        res.status(400).json({ message: "❌ Database Response Nai Kar Rahi", error });
    }
});

// 📥 Read One (GET by ID)
app.get('/:id', async (req, res) => {
    try {
        const singleData = await Model.findById(req.params.id);
        if (!singleData) return res.status(404).json({ message: "❌ Data Not Found" });
        res.status(200).json(singleData);
    } catch (error) {
        res.status(400).json({ message: "❌ Database Error", error });
    }
});

// 🗑️ Delete (DELETE by ID)
app.delete('/:id', async (req, res) => {
    try {
        const deleted = await Model.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "❌ Data Not Found" });
        res.status(200).json({ message: `✅ Document with name ${deleted.name} deleted.` });
    } catch (error) {
        res.status(400).json({ message: "❌ Data Delete Nai Hua", error });
    }
});

// ✏️ Update (PUT by ID)
app.put('/:id', async (req, res) => {
    try {
        const updated = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "❌ Data Not Found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "❌ Data Update Nai Ho Raha", error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
