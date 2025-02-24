"use client";

import type { NextPage } from "next";
import { AboutUsArticle } from "~~/app/about-us/_components/AboutUsArticle";

const AboutUs: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="text-center text-lg">
            <AboutUsArticle />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
