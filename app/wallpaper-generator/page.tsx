"use client";

import { Righteous } from "next/font/google";
import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";

const inter = Righteous({
  subsets: ["latin"],
  weight: ["400"],
});

export default function WallPaper() {
  const quotes = [
    {
      text: "To thine own self be === true",
    },
    {
      text: `You can succeed despite a lot of odds because most people can't be intentional or create frameworks to bind their decisions`,
    },
    {
      text: `These.... like right now, not later, are the days of your entire LIFE. How did you choose to spend it?`,
    },
    {
      text: `Follow your gut, your gut is very very TRUE`,
    },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [quote, setQuote] = useLocalStorage("quote", quotes[quoteIndex].text);

  useEffect(() => {
    setQuote(quotes[quoteIndex].text);
  }, [quoteIndex]);

  const handleNextQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex(
      (prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length
    );
  };

//   const handleUploadImage = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//     //   setBackgroundImage(reader.result);
//     };

//     reader.readAsDataURL(file);
//   };

  return (
    <div
      className={`flex items-center flex-col justify-center bg-black ${inter.className}`}
    >
      <div className="flex items-center justify-center flex-col gap-8 h-screen w-screen text-center">
        <svg
          className="top-0 w-10 h-10 fill-current text-white"
          viewBox="0 0 24 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 13.517c0-2.346.611-4.774 1.833-7.283C3.056 3.726 4.733 1.648 6.865 0L11 2.696C9.726 4.393 8.777 6.109 8.152 7.844c-.624 1.735-.936 3.589-.936 5.56v4.644H0v-4.531zm13 0c0-2.346.611-4.774 1.833-7.283 1.223-2.508 2.9-4.586 5.032-6.234L24 2.696c-1.274 1.697-2.223 3.413-2.848 5.148-.624 1.735-.936 3.589-.936 5.56v4.644H13v-4.531z" />
        </svg>
        <div className={`text-white text-8xl ${inter.className}`}>{quote}</div>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-white text-black font-bold py-2 px-4 rounded-full"
          onClick={handlePrevQuote}
        >
          Prev
        </button>
        <button
          className="bg-white text-black font-bold py-2 px-4 rounded-full"
          onClick={handleNextQuote}
        >
          Next
        </button>
      </div>
    </div>
  );
}
