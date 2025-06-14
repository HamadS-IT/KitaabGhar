/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../api/axios';
import { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import Loader from "./Loader";
const Favourite = () => {
  const [FavBooks, setFavBooks] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        "/favourite/getFavouriteBooks",
        { headers }
      );

      setFavBooks(res.data.data);

      // const res = await axios.get(
      //   "/books/purchased",
      //   { headers }
      // );

      // setFavBooks(res.data.purchasedBooks);
    };
    fetch();
  },[]);

  return (
    <>
      {!FavBooks && <Loader />}
      {FavBooks && FavBooks.length === 0 && (
        <div className="h-[80vh] p-4 text-zinc-100 ">
          <div className="h-[100%] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
              No favourite book
            </h1>
            <img src="./star.png" alt="" className="h-[20vh] mb-8" />
          </div>
        </div>
      )}
      {FavBooks && FavBooks.length !== 0 && (
        <div className="">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Favourite books
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8">
            {FavBooks.map((items, i) => (
              <BookCard
                bookid={items._id}
                image={items.coverUrl}
                title={items.title}
                author={items.author}
                price={items.price}
                key={i}
                fav={true}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Favourite;
