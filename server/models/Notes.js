const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  title: { type: String, require: true },
  body: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
