import React from "react";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import '@fontsource/poppins'; // Default weight

const Hero = () => {
  return (
    <div className="bg-white h-auto lg:h-[89vh] w-full  flex flex-col lg:flex-row px-10 py-8 lg:py-0">
      <div className="w-full lg:w-3/6 h-[100%]  flex items-center justify-center ">
        <div className="w-full ">
          <h1 className="text-black text-6xl font-semibold text-center lg:text-left font-poppins">
            Discover, Publish and Read Your Favourite Books!
          </h1>
          <p className="text-xl text-zinc-800 mt-5 text-center lg:text-left font-poppins">
            Explore our Vast collection of books from diverse authors. Weather you're here to publish your own work
            or find your next great read, we've got you covered. Join our community of readers and authors today.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              to="/all-books"
              className="my-5 lg:my-8 text-1xl bg-white rounded-lg py-3 px-8 flex items-center justify-center text-zinc-800 font-semibold border border-dream-green hover:bg-dream-green transition-all duration-300 font-poppins"
            >
              Discover More
              <FaRegArrowAltCircleRight className="ml-2 text-lg" />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center  ">
        <img
          src="/Hero.jpeg"
          alt="hero"
          className="w-[500px] h-[500px] object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
