"use client";

import Controls from "../../../components/builder/Controls";
import OtherInfo from "../../../components/builder/OtherInfo";
import { Project, projects } from "../../../components/projects";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { IoMdBookmark } from "react-icons/io";

export type CurrentSlideData = {
  data: Project;
  index: number;
};

// backgroundImage: {
//   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//   "gradient-conic":
//     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
// },

const initData = projects[0];

export default function Blocks() {
  const [data, setData] = React.useState<Project[]>(projects.slice(1));
  const [transitionData, setTransitionData] = React.useState<Project>(
    projects[0]
  );
  const [currentSlideData, setCurrentSlideData] =
    React.useState<CurrentSlideData>({
      data: initData,
      index: 0,
    });

  return (
    <main
      className={`
        relative h-[70vh] select-none overflow-hidden text-white antialiased w-full`}
    >
      <AnimatePresence mode="wait">
        <BackgroundImage
          key="background-image"
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
        <div key="content" className="absolute z-20  h-full w-full">
          <div className=" flex h-full w-full grid-cols-10 flex-col md:grid">
            <div className="col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10">
              <motion.span
                layout
                className=" mb-2 h-1 w-5 rounded-full bg-white "
              />
              <OtherInfo
                data={transitionData ? transitionData : currentSlideData.data}
              />
              <motion.div layout className=" mt-5 flex items-center gap-3">
                <button
                  className="flex h-[41px] w-[41px] items-center justify-center rounded-full bg-yellow-500 text-xs  transition
            duration-300 ease-in-out hover:opacity-80 "
                >
                  <IoMdBookmark className=" text-xl" />
                </button>
                <a
                  href="mailto:tomide@merislabs.com"
                  target="_blank"
                  className=" w-fit rounded-full border-[1px] border-[#ffffff8f] px-6 py-3 text-[10px] font-thin transition duration-300
            ease-in-out hover:bg-white hover:text-black "
                >
                  BUILD WITH MERIS LABS
                </a>
              </motion.div>
            </div>
            <div className=" col-span-6 flex h-full flex-1 flex-col justify-start p-4 md:justify-center md:p-10">
              <div className=" flex w-full gap-6">
                {projects.map((data, index) => {
                  return (
                    <motion.div
                      className=" relative h-52 min-w-[250px] rounded-2xl shadow-md md:h-80 md:min-w-[208px]"
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                          duration: 0.4,
                        },
                      }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 100,
                      }}
                      key={`project-${data.name}-${index}`}
                    >
                      <motion.img
                        layoutId={`img-${data.img}`}
                        alt="Transition Image"
                        src={data.img}
                        className=" absolute h-full w-full  rounded-2xl  object-cover brightness-75 "
                      />
                      <motion.div className=" absolute z-10 flex h-full items-end p-4">
                        <motion.div>
                          <motion.div
                            layout
                            className=" mb-2 h-[2px] w-3 rounded-full bg-white"
                          ></motion.div>
                          <motion.p
                            layoutId={`tag-${data.tag}`}
                            className="text-xs text-[#D5D5D6]"
                          >
                            {data.tag}
                          </motion.p>
                          <motion.h1
                            layoutId={`name-${data.name}`}
                            className="text-xl leading-6 text-white"
                          >
                            {data.name}
                          </motion.h1>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              <Controls
                currentSlideData={currentSlideData}
                data={data}
                transitionData={transitionData}
                initData={initData}
                handleData={setData}
                handleTransitionData={setTransitionData}
                handleCurrentSlideData={setCurrentSlideData}
                sliderData={projects}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </main>
  );
}

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

// Internal BackgroundImage component (not exported)
const BackgroundImage = ({ transitionData, currentSlideData }: Props) => {
  const [currentGradient] = useState(() => {
    const gradients = [
      "bg-gradient-to-r from-purple-600 to-blue-500",
      "bg-gradient-to-l from-blue-500 to-purple-600",
      "bg-gradient-to-r from-indigo-500 to-pink-500",
      "bg-gradient-to-l from-green-500 to-blue-600",
      "bg-gradient-to-r from-red-500 to-yellow-500",
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  });
  console.log('[BLOCKS] Rendering BackgroundImage with gradient:', currentGradient, 'transitionData:', transitionData, 'currentSlideData:', currentSlideData);
  return (
    <motion.div
      className={`absolute left-0 top-0 h-full w-full ${currentGradient}`}
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
};
