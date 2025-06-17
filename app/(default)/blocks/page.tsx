'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { IoMdBookmark } from 'react-icons/io';

export type Project = {
  name: string;
  tag: string;
  img: string;
};

export type CurrentSlideData = {
  data: Project;
  index: number;
};

const projects: Project[] = [
  {
    name: 'Canyon',
    tag: 'Photography',
    img: 'https://images.unsplash.com/photo-1627341893322-26245209930f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
  },
  {
    name: 'River',
    tag: 'Photography',
    img: 'https://images.unsplash.com/photo-1627341893322-26245209930f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
  },
  {
    name: 'Forest',
    tag: 'Photography',
    img: 'https://images.unsplash.com/photo-1627341893322-26245209930f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
  },
  {
    name: 'Mountain',
    tag: 'Photography',
    img: 'https://images.unsplash.com/photo-1627341893322-26245209930f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
  },
];

// backgroundImage: {
//   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//   "gradient-conic":
//     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
// },

const initData = projects[0];

// Define the prop types for BackgroundImage
type BackgroundImageProps = {
  transitionData: Project;
  currentSlideData: CurrentSlideData;
};

// Internal BackgroundImage component (not exported)
const BackgroundImage = ({ transitionData, currentSlideData }: BackgroundImageProps) => {
  const [currentGradient] = useState(() => {
    const gradients = [
      'bg-gradient-to-r from-purple-600 to-blue-500',
      'bg-gradient-to-l from-blue-500 to-purple-600',
      'bg-gradient-to-r from-indigo-500 to-pink-500',
      'bg-gradient-to-l from-green-500 to-blue-600',
      'bg-gradient-to-r from-red-500 to-yellow-500',
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  });
  console.log(
    '[BLOCKS] Rendering BackgroundImage with gradient:',
    currentGradient,
    'transitionData:',
    transitionData,
    'currentSlideData:',
    currentSlideData
  );
  return (
    <motion.div
      className={`absolute left-0 top-0 h-full w-full ${currentGradient}`}
      transition={{
        opacity: { ease: 'linear', duration: 0.6 },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Placeholder for additional content or elements */}
    </motion.div>
  );
};

// Define props for OtherInfo
type OtherInfoProps = {
  data: Project;
};

// Placeholder for OtherInfo component
const OtherInfo: React.FC<OtherInfoProps> = ({ data }) => {
  return (
    <div>
      <motion.p layoutId={`tag-${data.tag}`} className="text-xs text-[#D5D5D6]">
        {data.tag}
      </motion.p>
      <motion.h1 layoutId={`name-${data.name}`} className="text-xl leading-6 text-white">
        {data.name}
      </motion.h1>
    </div>
  );
};

// Define props for Controls
type ControlsProps = {
  currentSlideData: CurrentSlideData;
  handlePrevious: () => void;
  handleNext: () => void;
};

// Placeholder for Controls component
const Controls: React.FC<ControlsProps> = ({ handlePrevious, handleNext }) => {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button onClick={handlePrevious}>Prev</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default function Blocks() {
  const [data, setData] = React.useState<Project[]>(projects.slice(1));
  const [transitionData, setTransitionData] = React.useState<Project>(projects[0]);
  const [currentSlideData, setCurrentSlideData] = React.useState<CurrentSlideData>({
    data: initData,
    index: 0,
  });

  const handleNext = () => {
    setCurrentSlideData((prev) => {
      const nextIndex = (prev.index + 1) % projects.length;
      const nextData = projects[nextIndex];
      setTransitionData(nextData);
      setData(projects.filter((_, i) => i !== nextIndex));
      return { data: nextData, index: nextIndex };
    });
  };

  const handlePrevious = () => {
    setCurrentSlideData((prev) => {
      const prevIndex = (prev.index - 1 + projects.length) % projects.length;
      const prevData = projects[prevIndex];
      setTransitionData(prevData);
      setData(projects.filter((_, i) => i !== prevIndex));
      return { data: prevData, index: prevIndex };
    });
  };

  return (
    <main
      className={`
        relative h-[70vh] select-none overflow-hidden text-white antialiased w-full`}
    >
      <AnimatePresence mode="wait">
        <BackgroundImage key="background-image" transitionData={transitionData} currentSlideData={currentSlideData} />
        <div key="content" className="absolute z-20  h-full w-full">
          <div className=" flex h-full w-full grid-cols-10 flex-col md:grid">
            <div className="col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10">
              <motion.span layout className=" mb-2 h-1 w-5 rounded-full bg-white " />
              <OtherInfo data={transitionData ? transitionData : currentSlideData.data} />
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
                {data.map((project: Project, index: number) => {
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
                        type: 'spring',
                        damping: 20,
                        stiffness: 100,
                      }}
                      key={`project-${project.name}-${index}`}
                    >
                      <motion.img
                        layoutId={`img-${project.img}`}
                        alt="Transition Image"
                        src={project.img}
                        className=" absolute h-full w-full  rounded-2xl  object-cover brightness-75 "
                      />
                      <motion.div className=" absolute z-10 flex h-full items-end p-4">
                        <motion.div>
                          <motion.div layout className=" mb-2 h-[2px] w-3 rounded-full bg-white"></motion.div>
                          <motion.p layoutId={`tag-${project.tag}`} className="text-xs text-[#D5D5D6]">
                            {project.tag}
                          </motion.p>
                          <motion.h1 layoutId={`name-${project.name}`} className="text-xl leading-6 text-white">
                            {project.name}
                          </motion.h1>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              <Controls currentSlideData={currentSlideData} handlePrevious={handlePrevious} handleNext={handleNext} />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </main>
  );
}
