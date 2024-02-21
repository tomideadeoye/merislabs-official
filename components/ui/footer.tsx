import Link from "next/link";
import { FaMedium, FaXTwitter } from "react-icons/fa6";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  interface Social {
    name: string;
    link: string;
    icon: JSX.Element;
  }

  const socials: Social[] = [
    {
      name: "Twitter",
      link: "https://twitter.com/Tomideadeoye",
      icon: <FaXTwitter />,
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/company/35651921",
      icon: <FaLinkedin />,
    },
    {
      name: "Github",
      link: "https://github.com/tomideadeoye",
      icon: <FaGithub className="text-black dark:text-white" />,
    },
    {
      name: "Medium",
      link: "https://medium.com/@tomideadeoye",
      icon: <FaMedium />,
    },
  ];

  const footers = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
      ],
    },
  ];

  return (
    <footer>
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top area: Blocks */}
          <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12">
            {/* 1st block */}
            <div className="md:col-span-4 lg:col-span-5">
              <div className="mb-2">
                {/* Logo */}
                <Link href="/" className="inline-block" aria-label="Cruip">
                  <svg
                    className="w-8 h-8 fill-current text-purple-600"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
                  </svg>
                </Link>
              </div>
              <div className="text-gray-400">
                Tailored software solutions for businesses across diverse
                industries. Our objective is simply understanding your business
                - operations, model, customers, and goals. MerisLabs make
                creating a business easy by aggregating needs tools in one
                place.
              </div>
            </div>

            {/* 2nd, 3rd and 4th blocks */}
            <div className="md:col-span-8 lg:col-span-7 grid sm:grid-cols-3 gap-8">
              {/* 2nd block */}
              {/* {footers.map(() => (
                <div key={Math.random()} className="text-sm">
                  <h6 className="text-gray-200 font-medium mb-1">Products</h6>
                  <ul>
                    <li className="mb-1">
                      <Link
                        href="/"
                        className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                      >
                        Web Studio
                      </Link>
                    </li>
                    <li className="mb-1">
                      <Link
                        href="/"
                        className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                      >
                        DynamicBox Flex
                      </Link>
                    </li>
                    <li className="mb-1">
                      <Link
                        href="/"
                        className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                      >
                        Programming Forms
                      </Link>
                    </li>
                  </ul>
                </div>
              ))} */}
            </div>
          </div>

          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between">
            <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0 gap-3">
              {socials.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="flex p-2 justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-gray-400 text-sm mr-4">
              &copy; merislabs.com. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
