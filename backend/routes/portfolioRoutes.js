const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

router.post('/save', async (req, res) => {
    try {
        const { username, title, theme, sections } = req.body;
        let portfolio = await Portfolio.findOneAndUpdate(
            { username },
            { title, theme, sections },
            { new: true, upsert: true }
        );
        res.status(200).json(portfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ username: req.params.username });
        if (!portfolio) return res.status(404).send('Portfolio not found');
        
        res.render('template', { portfolio });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;