import { useState } from "react";
import { Document, Page } from "react-pdf";
import Chatbot from "./Chatbot";
import { Plus, Minus, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import Notes from "./Notes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PDFViewer = ({ bookId, title, onClose }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(0.3);
    const [readingMode, setReadingMode] = useState(false);
    const [goToPageInput, setGoToPageInput] = useState("");
    const [showGoToInput, setShowGoToInput] = useState(false);

    const getPdfUrl = () => `http://64.225.55.178:3000/api/v1/books/getBookFile/${encodeURIComponent(bookId)}`;

    const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
    const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.05, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.05, 0.2));
    const toggleReadingMode = () => setReadingMode((prev) => !prev);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleGoToPage = (e) => {
        e.preventDefault();
        const page = parseInt(goToPageInput);
        if (page && page > 0 && page <= numPages) {
            setPageNumber(page);
            setShowGoToInput(false);
            setGoToPageInput("");
        }
    };

    const toggleGoToInput = () => {
        setShowGoToInput(!showGoToInput);
        setGoToPageInput("");
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Main PDF Container */}
            <div className="flex-1 relative overflow-hidden">
                {/* PDF Document with proper scrolling */}
                <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4">
                    <div className="relative shadow-2xl">
                        <Document 
                            file={getPdfUrl()} 
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="text-white">Loading PDF...</div>}
                        >
                            <Page 
                                pageNumber={pageNumber} 
                                scale={scale} 
                                renderAnnotationLayer={false} 
                                renderTextLayer={false}
                                className="transition-all duration-300"
                                width={Math.min(window.innerWidth * 0.9, 1200)}
                            />
                        </Document>

                        {/* Navigation Arrows */}
                        {!readingMode && (
                            <>
                                <button 
                                    onClick={prevPage}
                                    disabled={pageNumber <= 1}
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-gray-900/80 hover:bg-gray-700/90 text-white p-3 rounded-full transition-all duration-300 shadow-lg ${pageNumber <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:scale-110'}`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={nextPage}
                                    disabled={pageNumber >= (numPages || Infinity)}
                                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-gray-900/80 hover:bg-gray-700/90 text-white p-3 rounded-full transition-all duration-300 shadow-lg ${pageNumber >= (numPages || Infinity) ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:scale-110'}`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Click to Navigate (Full Screen Areas) */}
                <div className="absolute inset-0 flex pointer-events-none">
                    <div 
                        className="w-1/2 h-full cursor-pointer hover:bg-white/5 transition pointer-events-auto"
                        onClick={prevPage}
                    />
                    <div 
                        className="w-1/2 h-full cursor-pointer hover:bg-white/5 transition pointer-events-auto"
                        onClick={nextPage}
                    />
                </div>
            </div>

            {/* UI Controls */}
            {!readingMode && (
                <>
                    {/* Zoom Controls */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 bg-gray-900/80 p-2 rounded-lg shadow-lg z-50">
                        <button 
                            onClick={zoomIn} 
                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center hover:scale-110"
                            title="Zoom In"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-center text-white">
                            {(scale * 100).toFixed(0)}%
                        </span>
                        <button 
                            onClick={zoomOut} 
                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center hover:scale-110"
                            title="Zoom Out"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Page Navigation Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-50">
                        {/* Go to Page Input */}
                        {showGoToInput && (
                            <form onSubmit={handleGoToPage} className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-lg shadow-lg">
                                <input
                                    type="number"
                                    min="1"
                                    max={numPages || 1}
                                    value={goToPageInput}
                                    onChange={(e) => setGoToPageInput(e.target.value)}
                                    className="w-16 px-2 py-1 text-sm bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Page #"
                                    autoFocus
                                />
                                <button 
                                    type="submit"
                                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition"
                                >
                                    Go
                                </button>
                                <button 
                                    type="button"
                                    onClick={toggleGoToInput}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                        
                        {/* Page Indicator (clickable) */}
                        {!showGoToInput && (
                            <div 
                                onClick={toggleGoToInput}
                                className="bg-gray-900/80 px-3 py-1 rounded-lg text-sm font-medium text-white shadow-lg cursor-pointer hover:bg-gray-800/90 transition"
                            >
                                Page {pageNumber} of {numPages || "..."}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Chatbot & Notes */}
            <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-3">
                {!readingMode && <Notes bookId={bookId} currentPage={pageNumber} />}
                {!readingMode && <Chatbot bookId={bookId} title={title} />}
            </div>
            
            {/* Reading Mode Toggle */}
            <button 
                onClick={toggleReadingMode} 
                className="absolute bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center z-50 hover:scale-110"
                title={readingMode ? "Show controls" : "Hide controls"}
            >
                <Eye className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition flex items-center justify-center z-50 hover:scale-110"
                title="Close PDF"
            >
                <X className="w-4 h-4" />
            </button>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default PDFViewer;









