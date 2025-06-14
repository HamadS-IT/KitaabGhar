// import { Link } from "react-router-dom";
// import axios from '../../api/axios';
// import { useState } from "react";
// import PDFViewer from "./PDFViewer"
// import PDFUnpaid from "./PDFUnpaid";

// const BookCard = ({ image, title, author, price, bookid, fav, pur, nonUser }) => {
//   const headers = {
//     bookid: bookid,
//     id: localStorage.getItem("id"),
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   };

//   const [showPdf, setShowPdf] = useState(false);
  

//   const removeFromFavourite = async () => {
//     try {
//       const response = await axios.put(
//         "/favourite/removeFromFavourite",
//         {},
//         { headers }
//       );
//       alert(response.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const closePdfViewer = () => {
//     setShowPdf(false); // Close the PDF viewer
//   };

//   return (
//     <div className="w-full bg-zinc-800 text-zinc-100 rounded p-4 mb-5">
//       <Link to={`/view-book-details/${bookid}`} className="">
//         <div className="w-full flex items-center justify-center bg-zinc-900 ">
//           <img src={image} alt="book" className="h-40 object-cover" />
//         </div>
//         <h1 className="mt-4 text-xl font-semibold">{title}</h1>
//         <p className="mt-2 text-zinc-400 font-semibold">by {author}</p>
//         <p className="mt-2 text-zinc-200 font-semibold text-xl">USD {price}</p>
//       </Link>
//       {fav === true && (
//         <button
//           className="mt-4 bg-red-100 w-full rounded text-red-600  py-2 font-semibold hover:bg-red-200 transition-all duration-300"
//           onClick={removeFromFavourite}
//         >
//           Remove from favourites
//         </button>
//       )}
//       {pur === true && (
//         <div>
//             {!showPdf ? (
//                 <button
//                     className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//                     onClick={() => setShowPdf(true)} // Show the PDF viewer on click
//                 >
//                     Read Book
//                 </button>
//             ) : (
//                 <PDFViewer 
//                   title={title} 
//                   bookId={bookid} 
//                   onClose={closePdfViewer} // Pass the close function here
//                 />
//             )}
//         </div>
//       )}
//       {nonUser === true && (
//         <div>
//             {!showPdf ? (
//                 <button
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600"
//                     onClick={() => setShowPdf(true)} // Show the PDF viewer on click
//                 >
//                     Preview Book
//                 </button>
//             ) : (
//                 <PDFUnpaid 
//                   title={title} 
//                   bookId={bookid} 
//                   onClose={closePdfViewer} // Pass the close function here
//                 />
//             )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookCard;

import { Link } from "react-router-dom";
import axios from '../../api/axios';
import { useState } from "react";
import PDFViewer from "./PDFViewer";
import PDFUnpaid from "./PDFUnpaid";
import { createPortal } from "react-dom";

const BookCard = ({ image, title, author, price, bookid, fav, pur, nonUser }) => {
  const headers = {
    bookid: bookid,
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const [showPdf, setShowPdf] = useState(false);
  
  const removeFromFavourite = async () => {
    try {
      const response = await axios.put(
        "/favourite/removeFromFavourite",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const closePdfViewer = () => {
    setShowPdf(false);
  };

  return (
    <>
      <div className="w-full bg-zinc-800 text-zinc-100 rounded p-4 mb-5">
        <Link to={`/view-book-details/${bookid}`} className="">
          <div className="w-full flex items-center justify-center bg-zinc-900 ">
            <img src={image} alt="book" className="h-40 object-cover" />
          </div>
          <h1 className="mt-4 text-xl font-semibold">{title}</h1>
          <p className="mt-2 text-zinc-400 font-semibold">by {author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">USD {price}</p>
        </Link>
        {fav === true && (
          <button
            className="mt-4 bg-red-100 w-full rounded text-red-600  py-2 font-semibold hover:bg-red-200 transition-all duration-300"
            onClick={removeFromFavourite}
          >
            Remove from favourites
          </button>
        )}
        {pur === true && (
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={() => setShowPdf(true)}
          >
            Read Book
          </button>
        )}
        {nonUser === true && (
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={() => setShowPdf(true)}
          >
            Preview Book
          </button>
        )}
      </div>

      {/* This will render outside the card */}
      {showPdf && pur && createPortal(
        <PDFViewer 
          title={title} 
          bookId={bookid} 
          onClose={closePdfViewer}
        />,
        document.body
      )}

      {showPdf && nonUser && createPortal(
        <PDFUnpaid 
          title={title} 
          bookId={bookid} 
          onClose={closePdfViewer}
        />,
        document.body
      )}
    </>
  );
};

export default BookCard;