"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UploadForm } from "~~/app/upload/_components/UploadForm";
import { Address } from "~~/components/scaffold-eth";

const UploadPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  return (
    <div className="pt-25">
      <div className="px-5 pt-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Upload Content</span>
        </h1>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
        <div className="text-center text-lg pt-5">
          <UploadForm />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
