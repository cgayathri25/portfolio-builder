const dns = require('dns');
// Forces the server to use Google's DNS to bypass local ISP/Campus blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const portfolioRoutes = require('./routes/portfolioRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine for dynamic portfolio rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enhanced MongoDB Connection (Updated for Mongoose 6/7+)
const connectionOptions = {
    serverSelectionTimeoutMS: 5000, // Still useful to catch network blocks quickly
};

mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => {
        console.log("------------------------------------------");
        console.log("SUCCESS: Connected to MongoDB Atlas");
        console.log("------------------------------------------");
    })
    .catch(err => {
        console.error("------------------------------------------");
        console.error("MONGODB CONNECTION ERROR:");
        console.error(err.message);
        console.log("------------------------------------------");
    });

// Routes
app.use('/api/portfolios', portfolioRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Portfolio Builder API is running...');
});

app.listen(PORT, () => {
    console.log(`Server active at http://localhost:${PORT}`);
});