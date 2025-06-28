const notesService = require('../services/notes');

// PUBLIC_INTERFACE
async function create(req, res) {
  /** Create a note (authenticated) */
  try {
    const note = notesService.createNote(req.user.id, req.body.title, req.body.content);
    return res.status(201).json({ note });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// PUBLIC_INTERFACE
async function list(req, res) {
  /** Get user's notes, optionally search */
  const search = req.query.search || '';
  const result = notesService.getNotes(req.user.id, search);
  return res.json({ notes: result });
}

// PUBLIC_INTERFACE
async function get(req, res) {
  /** Get a single note by ID */
  const note = notesService.getNoteById(req.user.id, req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  return res.json({ note });
}

// PUBLIC_INTERFACE
async function update(req, res) {
  /** Update a note by ID */
  const updates = {
    title: req.body.title,
    content: req.body.content
  };
  const note = notesService.updateNote(req.user.id, req.params.id, updates);
  if (!note) {
    return res.status(404).json({ message: 'Note not found or not yours' });
  }
  return res.json({ note });
}

// PUBLIC_INTERFACE
async function remove(req, res) {
  /** Delete a note by ID */
  const ok = notesService.deleteNote(req.user.id, req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Note not found or not yours' });
  }
  return res.json({ success: true });
}

module.exports = { create, list, get, update, remove };
