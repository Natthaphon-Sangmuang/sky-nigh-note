const Note = require("../models/noteModel");
const mongoose = require("mongoose");

// get all notes
const getNotes = async (req, res) => {
  const user_id = req.user._id;
  const numid = new RegExp(user_id);
  const notes = await Note.find({ user_id: numid }).sort({
    due_date: 1,
  });
  res.status(200).json(notes);
};

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

// create new note
const createNote = async (req, res) => {
  const { title, due_date, content, priority } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!due_date) {
    emptyFields.push("due_date");
  }
  if (!content) {
    emptyFields.push("content");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const note = await Note.create({
      title,
      due_date,
      content,
      priority,
      user_id,
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findOneAndDelete({ _id: id });

  if (!note) {
    return res.status(400).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!note) {
    return res.status(400).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
};
