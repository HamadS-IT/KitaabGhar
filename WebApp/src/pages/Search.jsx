import { useState } from 'react';
import NotesModal from '../components/NotesModal';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const handleSearch = () => {
        // Simulate a search operation
        const results = ['Result 1', 'Result 2', 'Result 3'].filter(result =>
            result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleAddNotes = () => {
        setIsModalOpen(true); // Open the modal
    };

    return (
        <div className="p-4 bg-gray-100 h-full">
            <h2 className="text-xl font-bold mb-4">Search</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white rounded-r-md px-4 hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            <div className="border border-gray-300 rounded-md p-4 mb-4 h-48 overflow-y-auto">
                <h3 className="font-semibold mb-2">Search Results:</h3>
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index} className="py-1 border-b last:border-b-0">
                                {result}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
            <button
                onClick={handleAddNotes}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
                Add Notes
            </button>

            {/* Render the NotesModal */}
            <NotesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Search;