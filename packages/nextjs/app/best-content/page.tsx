import React from "react";
import { Carousel } from "~~/app/best-content/_components/Carousel";

const BestContent = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Best Content Page</h1>
      <p>Welcome to the best content page in our Next.js app!</p>
      <Carousel />
    </div>
  );
};

export default BestContent;
