// import { useEffect, useState } from "react";
// import BookCard from "../components/Books/BookCard";
// import axios from '../api/axios';
// import Loader from "./Loader";
// import { useSelector } from "react-redux";

// const AllBooks = () => {

//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const role = useSelector((state) => state.auth.role);
//   const [allBooks, setAllBooks] = useState([]);
//   const [userBooks, setUserBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
    
//     const fetchAllBooks = async () => {
//       const response = await axios.get('/books/getAllBooks');
//       setAllBooks(response.data.books);
//     };
    
//     fetchAllBooks();
//   }, []);

//   useEffect(() => {
//     const headers = {
//       id: localStorage.getItem("id"),
//       authorization: `Bearer ${localStorage.getItem("token")}`,
//     };
    
//     const fetchUserBooks = async () => {
//       const res = await axios.get("/books/purchased", { headers });
//       setUserBooks(res.data.purchasedBooks);
//     };
    
//     fetchUserBooks();
//   }, []);

//   // This effect will update filteredBooks whenever allBooks or userBooks changes
//   useEffect(() => {
//     if (allBooks.length > 0 && userBooks) {
//       // Filter out books that the user already has
//       const remainingBooks = allBooks.filter(book => 
//         !userBooks.some(userBook => userBook._id === book._id)
//       );
//       setFilteredBooks(remainingBooks);
//     }
//   }, [allBooks, userBooks]);


//   return (
//     <>
//       {!filteredBooks && (
//         <div className="flex items-center justify-center h-[80vh]">
//           <Loader />
//         </div>
//       )}
      
//       {filteredBooks && (
//         <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 sm:px-6 py-12">
//           {/* Header Section */}
//           <div className="max-w-7xl mx-auto mb-12 text-center">
//             <h1 className="text-4xl md:text-5xl font-light text-zinc-100 mb-4">
//               Discover Your Next Read
//             </h1>
//             <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
//               {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available in our collection
//             </p>
//             <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-6 rounded-full"></div>
//           </div>
  
//           {/* Books Grid */}
//           <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//               {filteredBooks.map((items, i) => (
//                 <div 
//                   key={i}
//                   className="group transform transition-all duration-300 hover:-translate-y-2"
//                 >
//                   <div className="relative overflow-hidden rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
//                     <BookCard
//                       bookid={items._id}
//                       image={items.coverUrl}
//                       title={items.title}
//                       author={items.author}
//                       price={items.price}
//                       pur={role === "admin" ? true : false}
//                       nonUser={true}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
  
//           {/* Empty State (just in case) */}
//           {filteredBooks.length === 0 && (
//             <div className="text-center py-24">
//               <div className="inline-block p-6 bg-zinc-800 rounded-full mb-6">
//                 <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-medium text-zinc-300 mb-2">No Books Available</h2>
//               <p className="text-zinc-500 max-w-md mx-auto">
//                 We couldn't find any books matching your criteria.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default AllBooks;

import { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import axios from '../api/axios';
import Loader from "./Loader";
import { useSelector } from "react-redux";
import PDFUnpaid from "../components/Books/PDFUnpaid";

const AllBooks = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [allBooks, setAllBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [currentPdfBook, setCurrentPdfBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get('/books/getAllBooks');
        setAllBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      
      const fetchUserBooks = async () => {
        try {
          const res = await axios.get("/books/purchased", { headers });
          setUserBooks(res.data.purchasedBooks);
        } catch (error) {
          console.error("Error fetching user books:", error);
        }
      };
      
      fetchUserBooks();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (allBooks.length > 0) {
      const remainingBooks = isLoggedIn 
        ? allBooks.filter(book => 
            !userBooks.some(userBook => userBook._id === book._id)
          )
        : [...allBooks];
      setFilteredBooks(remainingBooks);
    }
  }, [allBooks, userBooks, isLoggedIn]);

  const handlePreviewClick = (book) => {
    setCurrentPdfBook(book);
    setShowPdf(true);
  };

  const closePdfViewer = () => {
    setShowPdf(false);
    setCurrentPdfBook(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 sm:px-6 py-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-zinc-100 mb-4">
            Discover Your Next Read
          </h1>
          <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available in our collection
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <div 
                  key={book._id}
                  className="group transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <BookCard
                      bookid={book._id}
                      image={book.coverUrl}
                      title={book.title}
                      author={book.author}
                      price={book.price}
                      pur={role === "admin"}
                      nonUser={!isLoggedIn || role !== "admin"}
                      onPreviewClick={() => handlePreviewClick(book)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-block p-6 bg-zinc-800 rounded-full mb-6">
                <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-zinc-300 mb-2">No Books Available</h2>
              <p className="text-zinc-500 max-w-md mx-auto">
                We couldn't find any books matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* PDF Viewer Modal */}
        {showPdf && currentPdfBook && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-full max-h-screen">
              <button 
                onClick={closePdfViewer}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-50"
                aria-label="Close PDF viewer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PDFUnpaid 
                title={currentPdfBook.title} 
                bookId={currentPdfBook._id} 
                onClose={closePdfViewer}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllBooks;