const mongoose = require('mongoose');

// ─── Element-level content schemas ───────────────────────────────────────────
// Each block type has its own content shape.
// We use a flexible approach: one schema per block type stored as a Mixed field,
// but with a discriminator-style type field so we know what shape to expect.

const ProjectItemSchema = new mongoose.Schema({
  name:        { type: String, default: 'Project Name' },
  description: { type: String, default: '' },
  link:        { type: String, default: '' },
}, { _id: false }); // no separate _id per project item needed

// ─── Block schema ─────────────────────────────────────────────────────────────
// One block = one draggable card on the canvas.
// theme lives HERE, not on the portfolio — each block has its own theme.

const BlockSchema = new mongoose.Schema({
  id:    { type: String, required: true },      // client-generated UUID
  type:  {
    type: String,
    required: true,
    enum: ['about', 'skills', 'projects', 'contact'],
  },
  theme: {
    type: String,
    required: true,
    enum: ['dark', 'minimal', 'light'],
    default: 'light',
  },
  order: { type: Number, required: true },      // position on canvas (0-indexed)

  // Content is stored as Mixed because each block type has a different shape.
  // The shape is enforced on the frontend via blockConfig.js, not the DB.
  content: {
    // Shared across all block types
    heading:            { type: String, default: '' },
    subheading:         { type: String, default: '' },

    // About
    bio: { type: String, default: '' },

    // Skills
    items: { type: mongoose.Schema.Types.Mixed, default: undefined },
    // For skills:   items = ['React', 'Node.js', ...]
    // For projects: items = [{ name, description, link }, ...]

    // Contact
    email:    { type: String, default: '' },
    github:   { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
}, { _id: false }); // blocks are embedded, no separate collection needed

// ─── Portfolio schema ─────────────────────────────────────────────────────────

const PortfolioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,    // store as lowercase so URLs are consistent
  },
  title: {
    type: String,
    required: true,
    default: 'My Portfolio',
  },

  // blocks replaces the old sections array.
  // No global theme field — theme is per block.
  blocks: {
    type: [BlockSchema],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ─── Auto-update updatedAt on save ───────────────────────────────────────────
PortfolioSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);