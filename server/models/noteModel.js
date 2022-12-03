const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    due_date: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    text_color: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema, "Note_db");
