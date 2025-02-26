import { useCallback, useEffect, useRef, useState } from "react";
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
  const [visibleSubscriptions, setVisibleSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [contentForSubscription, setContentForSubscription] = useState<Content[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const ITEMS_PER_PAGE = 6;
  const LOAD_MORE_COUNT = 3;

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const schemas = await fetchSchemas();
        setSubscriptions(schemas);
        setVisibleSubscriptions(schemas.slice(0, ITEMS_PER_PAGE));
        setHasMore(schemas.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptionData();
  }, []);

  const loadMoreItems = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextItems = subscriptions.slice(visibleSubscriptions.length, visibleSubscriptions.length + LOAD_MORE_COUNT);

      if (nextItems.length > 0) {
        setVisibleSubscriptions(prev => [...prev, ...nextItems]);
        setPage(prev => prev + 1);
        setHasMore(visibleSubscriptions.length + nextItems.length < subscriptions.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 500);
  }, [subscriptions, visibleSubscriptions, loadingMore, hasMore]);

  const lastCardRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMoreItems],
  );

  useEffect(() => {
    if (selectedSubscription) {
      setContentForSubscription([]);

      const timer = setTimeout(() => {
        const filteredContent = contents.filter(content => content.tags.includes(selectedSubscription.tier));
        setContentForSubscription(filteredContent);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedSubscription]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 drop-shadow-xl">
                {visibleSubscriptions.map((subscription, index) => {
                  const isLastItem = index === visibleSubscriptions.length - 1;

                  return (
                    <div
                      key={index}
                      ref={isLastItem ? lastCardRef : null}
                      className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedSubscription(subscription)}
                    >
                      <div className="w-24 h-24 mb-4 rounded-full border border-gray-900 overflow-hidden">
                        <Image
                          src={subscription.image}
                          alt={subscription.name}
                          width={96}
                          height={96}
                          loading="lazy"
                          className="contrast-50 object-cover w-full h-full"
                        />
                      </div>
                      <h2 className="text-xl font-bold mb-2">{subscription.name}</h2>
                      <p className="text-sm mb-4">{subscription.description}</p>
                      <p className="text-lg font-semibold">{subscription.price} ETH</p>
                    </div>
                  );
                })}
              </div>

              {loadingMore && (
                <div className="flex justify-center mt-8">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              )}

              {!hasMore && visibleSubscriptions.length > 0 && (
                <div className="text-center mt-8 text-gray-500">No more subscriptions to load</div>
              )}
            </>
          )}
        </div>

        {selectedSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedSubscription.name}</h2>
              <p className="mb-4">{selectedSubscription.description}</p>
              <p className="text-lg font-semibold mb-4">{selectedSubscription.price} ETH</p>

              <div className="mb-4">
                {contentForSubscription.length > 0 ? (
                  contentForSubscription.map((content, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-xl font-bold">{content.title}</h3>
                      <p>{content.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center py-4">
                    <div className="loading loading-spinner loading-md"></div>
                  </div>
                )}
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setSelectedSubscription(null);
                  setContentForSubscription([]);
                }}
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
