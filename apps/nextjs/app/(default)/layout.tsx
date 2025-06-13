"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import PageIllustration from "../../components/page-illustration";
import { Footer } from "@repo/ui";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-out-sine",
    });
  }, []); // Correctly empty dependency array to run only once

  return (
    <>
      <main className="grow">
        <PageIllustration />

        {children}
      </main>

      <Footer />
    </>
  );
}
