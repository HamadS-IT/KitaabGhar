import { useState, useEffect } from "react";
import { Pencil, X, Trash, Edit, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const Notes = ({ bookId, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (bookId) {
      fetchNotes();
    }
  }, [bookId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/notes/getNotes/${bookId}`, { headers });
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Recently";
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.warning("Please add a title");
      return;
    }
    if (!content.trim()) {
      toast.warning("Please add note content");
      return;
    }

    setIsSaving(true);
    try {
      const noteData = { 
        bookId, 
        currentPage, 
        noteTitle: title, 
        noteContent: content 
      };

      let response;
      if (editingNoteId) {
        response = await axios.put('/notes/updateNote', { 
          noteID: editingNoteId, 
          noteTitle: title, 
          noteContent: content 
        }, { headers });
        toast.success("Note updated successfully");
      } else {
        response = await axios.post("/notes/addNote", noteData, { headers });
        toast.success("Note added successfully");
      }

      // Update state optimistically
      if (response.data?.note) {
        const updatedNote = response.data.note;
        setNotes(prev => editingNoteId
          ? prev.map(n => n._id === editingNoteId ? updatedNote : n)
          : [updatedNote, ...prev]
        );
      } else {
        await fetchNotes(); // Refresh if no data returned
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error(error.response?.data?.error || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete('/notes/deleteNote', { 
        data: { noteID: noteId },
        headers 
      });
      setNotes(prev => prev.filter(note => note._id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNoteId(null);
  };

  const handleEditNote = (note) => {
    setTitle(note.noteTitle);
    setContent(note.noteContent);
    setEditingNoteId(note._id);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Add Note Button */}
      <div 
        className="fixed bottom-6 right-6 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center"
            aria-label="Add new note"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
              >
                Add Note
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingNoteId ? "Edit Note" : "Add Note"}
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Editor Section */}
                <div className="w-full md:w-2/3 p-6 border-r overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content *
                      </label>
                      <textarea
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="text-sm text-gray-500">
                      Page: {currentPage || 'Not specified'}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-70 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingNoteId ? (
                        "Update Note"
                      ) : (
                        "Save Note"
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes List Section */}
                <div className="w-full md:w-1/3 p-6 bg-gray-50 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                    Your Notes
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No notes yet. Add your first note!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <motion.div
                          key={note._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {note.noteTitle}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {note.noteContent}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-2">
                                <span>Page {note.currentPage}</span>
                                <span>•</span>
                                <span>{formatDate(note.createdAt)}</span>
                                {note.updatedAt && note.updatedAt !== note.createdAt && (
                                  <span title={`Updated ${formatDate(note.updatedAt)}`}>
                                    • (edited)
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="text-emerald-600 hover:text-emerald-800"
                                aria-label="Edit note"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete note"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notes;








// import { useState, useEffect } from "react";
// import { Pencil, X, Trash, Edit } from "lucide-react";
// import { motion } from "framer-motion";
// import axios from "../../api/axios"

// const Notes = ({ bookId, currentPage }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const [title, setTitle] = useState("");
//     const [note, setNote] = useState("");
//     const [notes, setNotes] = useState([]);
//     const [editingNote, setEditingNote] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const headers = {
//         id: localStorage.getItem("id"),
//         authorization: `Bearer ${localStorage.getItem("token")}`,
//       };

//     useEffect(() => {
//         fetchNotes();
//     }, [bookId]);

//     const fetchNotes = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`/notes/getNotes/${bookId}`, { headers });
//             setNotes(response.data.notes);
//         } catch (error) {
//             console.error("Error fetching notes:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const saveNote = async () => {
//         if (!title.trim() || !note.trim()) return;

//         const noteData = { bookId, currentPage, noteTitle: title, noteContent: note };
//         try {
//             if (editingNote) {
//                 await axios.put(`http://localhost:1000/api/v1/notes/${editingNote.id}`, noteData);
//             } else {
//                 await axios.post("/notes/addNote", noteData, { headers });
//             }
//             setTitle("");
//             setNote("");
//             setEditingNote(null);
//             fetchNotes();
//             setIsOpen(false);
//         } catch (error) {
//             console.error("Error saving note:", error);
//         }
//     };

//     const deleteNote = async (id) => {
//         if (window.confirm("Are you sure you want to delete this note?")) {
//             try {
//                 await axios.delete(`/deleteNote`);
//                 fetchNotes();
//             } catch (error) {
//                 console.error("Error deleting note:", error);
//             }
//         }
//     };

//     return (
//         <>
//             <div className="fixed bottom-3 right-7 flex items-center space-x-3 mb-28"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}>
//                 {isHovered && (
//                     <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
//                         className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-md font-bold text-lg">
//                         Add Notes
//                     </motion.div>
//                 )}
//                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                     className="bg-[#5BA191] p-4 rounded-full shadow-xl cursor-pointer hover:bg-[#4A8B78] transition"
//                     onClick={() => setIsOpen(true)}>
//                     <Pencil className="text-white w-12 h-12 " />
//                 </motion.div>
//             </div>

//             {isOpen && (
//                 <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
//                     className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white w-[700px] p-5 rounded-lg shadow-xl flex">
//                         <div className="w-2/3 pr-5 border-r">
//                             <div className="flex justify-between items-center border-b pb-2">
//                                 <span className="text-xl font-semibold text-gray-900">{editingNote ? "Edit Note" : "Add Note"}</span>
//                                 <X className="cursor-pointer text-gray-700 hover:text-black" onClick={() => setIsOpen(false)} />
//                             </div>
//                             <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
//                                 className="w-full p-2 mt-3 border rounded text-gray-900" />
//                             <textarea placeholder="Write your note here..." value={note} onChange={(e) => setNote(e.target.value)}
//                                 className="w-full p-2 mt-3 border rounded h-32 text-gray-900"></textarea>
//                             <div className="mt-3 text-gray-600">Page: {currentPage}</div>
//                             <div className="flex justify-end space-x-2 mt-4">
//                                 <button onClick={() => setIsOpen(false)}
//                                     className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-200">Cancel</button>
//                                 <button onClick={saveNote}
//                                     className="px-4 py-2 bg-[#5BA191] text-white rounded hover:bg-[#4A8B78]">Save</button>
//                             </div>
//                         </div>
//                         <div className="w-1/3 pl-5">
//                             <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">Your Notes</h3>
//                             {isLoading ? (
//                                 <p className="text-gray-600 text-sm">Loading notes...</p>
//                             ) : notes.length === 0 ? (
//                                 <p className="text-gray-600 text-sm">No notes added yet.</p>
//                             ) : (
//                                 notes.map((note) => (
//                                     <div key={note.id} className="p-3 border rounded mb-2 flex justify-between items-start bg-gray-50 hover:bg-gray-100 transition">
//                                         <div className="w-full">
//                                             <div className="font-bold text-gray-900">{note.title}</div>
//                                             <div className="text-sm text-gray-700 mt-1">{note.content}</div>
//                                             <div className="text-xs text-gray-500 mt-1">Page: {note.page} | {new Date(note.timestamp).toLocaleString()}</div>
//                                         </div>
//                                         <div className="flex space-x-2 ml-3">
//                                             <Edit className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => {
//                                                 setEditingNote(note);
//                                                 setTitle(note.title);
//                                                 setNote(note.content);
//                                                 setIsOpen(true);
//                                             }} />
//                                             <Trash className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => deleteNote(note.id)} />
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 </motion.div>
//             )}
//         </>
//     );
// };

// export default Notes;