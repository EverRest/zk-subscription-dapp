"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ContactForm } from "~~/app/contact-us/_components/ContactForm";
import { Address } from "~~/components/scaffold-eth";

const ContactUs: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  return (
    <>
      <div className="pt-25">
        <div className="px-5 pt-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Contact Us</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="text-center text-lg pt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
