const notes = []; // In-memory notes store

// Each note: { id, userId, title, content, createdAt, updatedAt }

// PUBLIC_INTERFACE
function createNote(userId, title, content) {
  /** Create a note for given user */
  const note = {
    id: notes.length + 1,
    userId,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.push(note);
  return { ...note };
}

// PUBLIC_INTERFACE
function getNotes(userId, search = '') {
  /**
   * Get all notes for user, optionally filter by search term (in title/content)
   */
  return notes
    .filter(note => note.userId === userId)
    .filter(note =>
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );
}

// PUBLIC_INTERFACE
function getNoteById(userId, noteId) {
  /** Get a single note by id for a user */
  const note = notes.find(n => n.userId === userId && n.id === Number(noteId));
  return note ? { ...note } : null;
}

// PUBLIC_INTERFACE
function updateNote(userId, noteId, updates) {
  /** Update a note's title/content for a user */
  const idx = notes.findIndex(n => n.userId === userId && n.id === Number(noteId));
  if (idx === -1) return null;
  notes[idx] = {
    ...notes[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return { ...notes[idx] };
}

// PUBLIC_INTERFACE
function deleteNote(userId, noteId) {
  /** Delete a note by id for a user */
  const idx = notes.findIndex(n => n.userId === userId && n.id === Number(noteId));
  if (idx === -1) return false;
  notes.splice(idx, 1);
  return true;
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
