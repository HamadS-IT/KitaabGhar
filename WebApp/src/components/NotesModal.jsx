import React, { useState } from 'react';

const NotesModal = ({ isOpen, onClose }) => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        // Logic to save the note
        alert(`Note saved: ${note}`);
        setNote(''); // Clear the input after saving
        onClose(); // Close the modal
    };

    if (!isOpen) return null; // Don't render anything if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Add Notes</h2>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your notes here..."
                    className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;