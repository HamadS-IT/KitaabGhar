/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../api/axios';
import { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import Loader from "./Loader";

const UserBooks = () => {
    const [books, setBooks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const headers = {
                    id: localStorage.getItem("id"),
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                };

                const res = await axios.get("/books/getPublisherBooks", { headers });
                setBooks(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch books:", err);
                setError("Failed to load books. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center px-6 text-zinc-200 bg-zinc-900">
                <h1 className="text-3xl font-semibold text-red-500 mb-3">Oops!</h1>
                <p className="text-lg text-zinc-400 text-center max-w-md">
                    {error}
                </p>
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center px-6 text-zinc-100 bg-zinc-900">
                <img
                    src="./star.png"
                    alt="No books"
                    className="h-[140px] opacity-60 mb-6"
                />
                <h2 className="text-4xl font-bold text-zinc-500 mb-2">
                    No Books Yet
                </h2>
                <p className="text-zinc-400 text-center max-w-md">
                    You haven’t published any books yet. Once you do, they’ll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 text-center mb-12">
                    My Published Books
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            bookid={book._id}
                            image={book.coverUrl}
                            title={book.title}
                            author={book.author}
                            price={book.price}
                            pur={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserBooks;
