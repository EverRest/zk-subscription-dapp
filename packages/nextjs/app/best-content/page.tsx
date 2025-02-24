"use client";

import type { NextPage } from "next";
import { Carousel } from "~~/app/best-content/_components/Carousel";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="text-center text-lg">
            <Carousel />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
