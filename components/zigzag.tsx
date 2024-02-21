import Image from "next/image";

import { projects } from "./projects";

export default function Zigzag() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-green-600 bg-green-200 rounded-full mb-4">
              Reach your business goals
            </div>
            <h1 className="h2 mb-4">Our Successes</h1>
            <p className="text-xl text-gray-400">
              We have experience in designing and developing web and mobile
              applications for various industries, from financial services to
              legal.
            </p>
          </div>

          {/* Items */}
          <div className="grid gap-20">
            {projects.map((project, index) => (
              <div
                className="md:grid md:grid-cols-12 md:gap-6 items-center"
                key={project.name}
              >
                <div
                  className={`max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl flex-row-reverse items-center`}
                  data-aos="fade-up"
                >
                  {project?.video && (
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      src={project?.video}
                      width="auto"
                      height="300px"
                      style={{
                        borderRadius: "10px",
                      }}
                    />
                  )}

                  {project.image && (
                    <Image
                      src={`/images/${project.image}`}
                      alt={project.name}
                      width={400}
                      height={400}
                      className="object-contain rounded-2xl px-4 self-center"
                      style={{
                        borderRadius: "40px",
                      }}
                    />
                  )}
                  {project.iframe && (
                    <iframe
                      title={project.name}
                      src={project.iframe}
                      width="540"
                      height="405"
                      className="object-contain rounded-2xl px-4 self-center"
                      style={{
                        borderRadius: "40px",
                      }}
                    />
                  )}
                </div>
                <div
                  className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6"
                  data-aos="fade-left"
                >
                  <div className="md:pl-4 lg:pl-12 xl:pl-16">
                    <div className="font-architects-daughter text-xl text-purple-600 mb-2">
                      {project.tag}
                    </div>
                    <h3 className="h3 mb-3">{project.name}</h3>
                    <p className="text-xl text-gray-400 mb-4">
                      {project.description}
                    </p>
                    <ul className="text-lg text-gray-400 -mb-2">
                      {Array.isArray(project?.technologies) &&
                        project?.technologies.map((tool, index) => (
                          <li className="flex items-center mb-2" key={tool}>
                            <svg
                              className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0"
                              viewBox="0 0 12 12"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                            </svg>
                            <span key={index}>{tool}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
