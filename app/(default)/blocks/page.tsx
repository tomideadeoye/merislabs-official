"use client";
import BackgroundImage from "@/components/builder/BackgroundImage";
import Controls from "@/components/builder/Controls";
import { AnimatePresence, motion } from "framer-motion";
import { Righteous } from "next/font/google";
import React from "react";
import OtherInfo from "@/components/builder/OtherInfo";
import { IoMdBookmark } from "react-icons/io";
import { Project, projects } from "@/components/projects";

const inter = Righteous({
  subsets: ["latin"],
  weight: ["400"],
});

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
       ${inter.className}
        relative min-h-screen select-none overflow-hidden text-white antialiased w-full`}
    >
      <AnimatePresence>
        <BackgroundImage
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
        <div className="absolute z-20  h-full w-full">
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
                {projects.map((data) => {
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
                      key={data.name}
                    >
                      <motion.img
                        layoutId={data.img}
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
                            layoutId={data.tag}
                            className="text-xs text-[#D5D5D6]"
                          >
                            {data.tag}
                          </motion.p>
                          <motion.h1
                            layoutId={data.name}
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
