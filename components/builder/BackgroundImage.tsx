import React, { useState, useEffect } from "react";
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
  // State to hold the current gradient
  const [currentGradient, setCurrentGradient] = useState("");

  // Function to generate a random gradient
  const generateGradient = () => {
    const gradients = [
      "bg-gradient-to-r from-purple-600 to-blue-500",
      "bg-gradient-to-l from-blue-500 to-purple-600",
      "bg-gradient-to-r from-indigo-500 to-pink-500",
      "bg-gradient-to-l from-green-500 to-blue-600",
      "bg-gradient-to-r from-red-500 to-yellow-500",
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  };

  return (
    <motion.div
      className={`absolute left-0 top-0 h-full w-full ${generateGradient()}`}
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
