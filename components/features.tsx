import { FaMobile, FaCode, FaCloud } from "react-icons/fa";

export default function Features() {
  const offerings = [
    {
      name: "Web Development",
      description:
        "Full-stack web development with a focus on notable frameworks like React, Node.js, and Next.js. ",
      icon: <FaCode />,
    },
    {
      name: "Mobile Development",
      description:
        "Cross-platform mobile development with a focus on React Native or Flutter.",
      icon: <FaMobile />,
    },
    {
      name: "Cloud Apps & Analytics",
      description:
        "Deploying and managing cloud applications primarily with AWS or Vercel when serverless.",
      icon: <FaCloud />,
    },
    // {
    //   name: "Indexing Large Data Sets for Chatbots",
    //   description:
    //     "We have experience in designing and developing cloud applications for various industries, from financial services to legal.",
    //   icon: "☁️",
    // },
  ];

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Services Provided and Products.</h2>
            <p className="text-xl text-gray-400">
              We have worked with enterprises, partnerships and startups in
              providing software focused solutions.
            </p>
          </div>

          {/* Items */}
          <div
            className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none"
            data-aos-id-blocks
          >
            {offerings.map((item) => (
              <div
                key={item.name}
                className="relative flex flex-col items-center"
                data-aos="fade-up"
                data-aos-anchor="[data-aos-id-blocks]"
              >
                <div className="w-16 h-16 mb-4 flex p-2 justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out">
                  {item.icon}
                </div>
                <h4 className="h4 mb-2">{item.name}</h4>
                <p className="text-lg text-gray-400 text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
