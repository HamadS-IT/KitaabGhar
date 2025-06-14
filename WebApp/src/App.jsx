import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import UserBooks from "./pages/UserBooks";
import ViewBookDetails from "./pages/ViewBookDetails";
import { authActions } from "./store/auth";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Publish from "./pages/Publish";
import PublisherBooks from "./pages/PublisherBooks";
import Favourite from "./pages/Favourite";
import OrderHistory from "./pages/OrderHistory";
import Settings from "./pages/Settings";
import AllOrders from "./components/AdminPages/AllOrders";
import AddBook from "./components/AdminPages/AddBook";
import UpdateBooks from "./components/AdminPages/UpdateBooks";

import '@fontsource/poppins'; // Default weight
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/user-books" element={<UserBooks />} />
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="pubish" element={<Publish />} />
        <Route path="/publisherbooks" element={<PublisherBooks />} />
        <Route path="/profile" element={<Profile />}>
        
          {role !== "admin" ? (
            <Route index element={<Favourite />} />
          ) : (
            <Route index element={<AllOrders />} />
          )}
          {role === "admin" && (
            <Route path="/profile/add-book" element={<AddBook />} />
          )}
          <Route path="/profile/OrderHistory" element={<OrderHistory />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Route>
        {role === "admin" && (
          <Route path="/update-book/:id" element={<UpdateBooks />} />
        )}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
