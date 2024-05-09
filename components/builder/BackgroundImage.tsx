import React from "react";
import { motion } from "framer-motion";

// Define the prop types
type Props = {
  transitionData: {
    img: string;
  };
  currentSlideData: {
    data: {
      img: string;
    };
  };
};

// Define the BackgroundImage component
function BackgroundImage({ transitionData, currentSlideData }: Props) {
  // Generate a random number to decide the gradient direction
  const randomNumber = Math.floor(Math.random() * 100);
  const isRandomNumberEven = randomNumber % 2 === 0;
  const backgroundStyle = isRandomNumberEven
    ? "bg-gradient-to-r from-purple-600 to-blue-500"
    : "bg-gradient-to-r from-blue-500 to-purple-600";

  return (
    <motion.div
      className={`absolute left-0 top-0 h-full w-full ${backgroundStyle}`}
      transition={{
        opacity: { ease: "linear", duration: 0.6 },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Placeholder for additional content or elements */}
    </motion.div>
  );
}

// Export the component
export default BackgroundImage;
