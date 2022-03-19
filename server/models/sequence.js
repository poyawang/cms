
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = mongoose.Schema({
  maxContactId: { type: String },
  maxDocumentId: { type: String },
  maxMessageId: { type: String },
});

module.exports = mongoose.model('Sequence', sequenceSchema);
