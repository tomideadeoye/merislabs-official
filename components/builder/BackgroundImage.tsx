import React from "react";
import { motion } from "framer-motion";
import { Project } from "../projects";
import { CurrentSlideData } from "@/app/(default)/blocks/page";

type Props = {
  transitionData: Project;
  currentSlideData: CurrentSlideData;
};

function BackgroundImage({ transitionData, currentSlideData }: Props) {
  const randomNumer = Math.floor(Math.random() * 100);
  const isRandomRandomNumberEven = randomNumer % 2 === 0;

  return (
    <>
      {transitionData && (
        <motion.img
          key={transitionData.img}
          layoutId={transitionData.img}
          alt="Transition Image"
          transition={{
            opacity: { ease: "linear" },
            layout: { duration: 0.6 },
          }}
          className=" absolute left-0 top-0 z-10 h-full w-full object-cover brightness-50"
          src={isRandomRandomNumberEven ? "/web.png" : "/designs.png"}
        />
      )}
      <motion.img
        alt="Current Image"
        key={currentSlideData.data.img + "transition"}
        src={isRandomRandomNumberEven ? "/web.png" : "/designs.png"}
        className=" absolute left-0 top-0 h-full w-full object-cover brightness-50"
      />
    </>
  );
}

export default BackgroundImage;
