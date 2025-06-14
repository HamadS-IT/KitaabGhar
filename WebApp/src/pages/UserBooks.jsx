/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../api/axios';
import { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import Loader from "./Loader";

const UserBooks = () => {
  const [favBooks, setFavBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/books/purchased", { headers });
        setFavBooks(res.data.purchasedBooks);
      } catch (err) {
        console.error("Failed to fetch purchased books:", err);
        setError("Failed to load your books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 max-w-md">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (favBooks.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center max-w-md">
          <div className="inline-block p-5 bg-amber-100 rounded-full mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-amber-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-800 mb-4">Your Library is Empty</h1>
          <p className="text-zinc-600 mb-8">
            You haven't purchased any books yet. Explore our collection to find your next read!
          </p>
          <a
            href="/all-books"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Books
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-zinc-50 to-zinc-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4">
            My Library
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            {favBooks.length} {favBooks.length === 1 ? 'book' : 'books'} in your collection
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favBooks.map((book) => (
            <div 
              key={book._id}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <BookCard
                bookid={book._id}
                image={book.coverUrl}
                title={book.title}
                author={book.author}
                price={book.price}
                pur={true}
              />
            </div>
          ))}
        </div>

        {favBooks.length > 8 && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 border-2 border-amber-500 text-amber-500 font-medium rounded-lg hover:bg-amber-50 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBooks;