
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String },
   url: { type: String, required: true }
});

module.exports = mongoose.model('Document', documentSchema);
