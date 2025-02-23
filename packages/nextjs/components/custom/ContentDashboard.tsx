import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { fetchSchemas } from "~~/services/api/schemaApi";
import type { Content, Subscription } from "~~/types/types";

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const schemas = await fetchSchemas();
        setSubscriptions(schemas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 drop-shadow-xl">
            {subscriptions.map((subscription, index) => (
              <div
                key={index}
                className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg transform transition-transform hover:scale-105"
                onClick={() => setSelectedSubscription(subscription)}
              >
                <div className="w-24 h-24 mb-4 rounded-full border border-gray-900 overflow-hidden">
                  <Image
                    src={subscription.image}
                    alt={subscription.name}
                    width={96}
                    height={96}
                    className="contrast-50 object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2">{subscription.name}</h2>
                <p className="text-sm mb-4">{subscription.description}</p>
                <p className="text-lg font-semibold">{subscription.price} ETH</p>
              </div>
            ))}
          </div>
        </div>

        {selectedSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedSubscription.name}</h2>
              <p className="mb-4">{selectedSubscription.description}</p>
              <p className="text-lg font-semibold mb-4">{selectedSubscription.price} ETH</p>
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
