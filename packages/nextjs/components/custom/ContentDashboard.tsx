"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import type { Content, Subscription } from "~~/types/types";

const subscriptions: Subscription[] = [
  {
    name: "Gold Membership",
    tier: "gold",
    description: "Access to premium content and features.",
    price: "1 ETH",
    image: "https://example.com/gold.png",
  },
  {
    name: "Silver Membership",
    tier: "silver",
    description: "Access to standard content and features.",
    price: "0.5 ETH",
    image: "https://example.com/silver.png",
  },
  {
    name: "Bronze Membership",
    tier: "bronze",
    description: "Access to basic content and features.",
    price: "0.1 ETH",
    image: "https://example.com/bronze.png",
  },
];

const contents: Content[] = [
  {
    title: "Exclusive Article",
    body: "This is an exclusive article for premium members.",
    tags: ["gold", "silver", "diamond"],
  },
  {
    title: "Standard Video",
    body: "This is a standard video for standard members.",
    tags: ["silver", "bronze"],
  },
  {
    title: "Basic Webinar",
    body: "This is a basic webinar for all members.",
    tags: ["bronze"],
  },
];

const ContentDashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.map((subscription, index) => (
              <div
                key={index}
                className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg transform transition-transform hover:scale-105"
                onClick={() => setSelectedSubscription(subscription)}
              >
                <img src={subscription.image} alt={subscription.name} className="h-24 w-24 mb-4" />
                <h2 className="text-xl font-bold mb-2">{subscription.name}</h2>
                <p className="text-sm mb-4">{subscription.description}</p>
                <p className="text-lg font-semibold">{subscription.price}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedSubscription.name}</h2>
              <p className="mb-4">{selectedSubscription.description}</p>
              <p className="text-lg font-semibold mb-4">{selectedSubscription.price}</p>
              <div className="mb-4">
                {contents
                  .filter(content => content.tags.includes(selectedSubscription.tier))
                  .map((content, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-xl font-bold">{content.title}</h3>
                      <p>{content.body}</p>
                    </div>
                  ))}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setSelectedSubscription(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentDashboard;
