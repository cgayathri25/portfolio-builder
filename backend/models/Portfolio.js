const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        default: 'default'
    },
    sections: [
        {
            id: String,
            type: { 
                type: String, 
                enum: ['About', 'Projects', 'Skills', 'Contact'] 
            },
            content: mongoose.Schema.Types.Mixed,
            order: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);