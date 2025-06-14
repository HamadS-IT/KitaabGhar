/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import BookCard from "../Books/BookCard";
import axios from '../../api/axios';
const RecentlyAdded = () => {
  const [Books, setBooks] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "books/recent"
      );
      setBooks(response.data.recentBooks);
    };
    fetch();
  }, []);

  return (
    <>
      {Books && (
        <div className="bg-zinc-900 px-12 py-8">
          <h1 className="text-yellow-100 text-3xl">Recently Added Books</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 mt-8">
            {Books.map((items, i) => (
              <BookCard
                bookid={items._id}
                image={items.coverUrl}
                title={items.title}
                author={items.author}
                price={items.price}
                key={i}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          {/* Background Blur Effect */}
          <div
            className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            aria-hidden="true"
          >
            <div
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#007E6F] to-[#007E6F] opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>

          {/* Heading Section */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[#007E6F]">
              Pricing
            </h2>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
              Choose the right plan for you!
            </p>
          </div>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
            Choose an affordable plan that’s packed with the best features you.
          </p>

          {/* Pricing Cards */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {/* Hobby Plan */}
            <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
              <h3 className="text-base font-semibold leading-7 text-[#007E6F]">
                Free Plan
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-gray-900">
                  $0
                </span>
                <span className="text-base text-gray-500">/month</span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-600">
                The perfect plan if you're just getting started with our
                product.
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10">
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Access to a Wide Selection of E-Books
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Basic Search Functionality
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reading Features
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  24-hour support response time
                </li>
              </ul>
              <a
                href="#"
                className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-[#007E6F] ring-1 ring-[#007E6F] hover:ring-[#007E6F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E6F] sm:mt-10"
              >
                Get started today
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="relative rounded-3xl bg-gray-900 p-8 ring-1 ring-gray-900/10 shadow-2xl sm:p-10">
              <h3 className="text-base font-semibold leading-7 text-[#007E6F]">
                Premium Plan
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-white">
                  $99
                </span>
                <span className="text-base text-gray-400">/month</span>
              </p>
              <p className="mt-6 text-base leading-7 text-gray-300">
                Dedicated support and response time for you.
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300 sm:mt-10">
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited Access to E-Books
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced Semantic Search
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ad-Free Experience
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority Customer Support
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Family Plan Option
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-[#007E6F]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <a
                href="#"
                className="mt-8 block rounded-md bg-[#007E6F] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#00695C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E6F] sm:mt-10"
              >
                Get started today
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentlyAdded;
