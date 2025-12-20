import { useEffect, useState } from "react";
import { getPublicStories } from "../services/storyServices";
import StoryChatbot from "../components/StoryChatbot";
import Footer from "./Footer";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [activeChatStoryId, setActiveChatStoryId] = useState(null);

  useEffect(() => {
    loadStories();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const res = await getPublicStories(page, 6);
      setStories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch stories", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            🌍 Public Stories
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Explore shared journeys from around the world
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading amazing stories...
            </p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border max-w-2xl mx-auto">
            <p className="text-gray-500 text-xl">
              No public stories available yet.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => {
                const user = story.userId;
                const isExpanded = expandedStoryId === story._id;
                const isChatOpen = activeChatStoryId === story._id;

                return (
                  <article
                    key={story._id}
                    className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative h-56">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.destination}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-300">
                          {user?.fullName?.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                        {story.mood}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-sm text-gray-500 mb-2">
                        ⏱ {story.duration}
                      </span>

                      <h3 className="text-xl font-bold mb-3">
                        {story.destination}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3">
                        {isExpanded
                          ? story.storyText
                          : story.storyText.slice(0, 150) +
                            (story.storyText.length > 150 ? "..." : "")}
                      </p>

                      {story.storyText.length > 150 && (
                        <button
                          onClick={() =>
                            setExpandedStoryId(
                              isExpanded ? null : story._id
                            )
                          }
                          className="text-blue-600 text-sm font-semibold mb-3"
                        >
                          {isExpanded ? "Show Less ▲" : "Read Full Story ▼"}
                        </button>
                      )}

                      {/* Chat Toggle */}
                      <button
                        onClick={() =>
                          setActiveChatStoryId(
                            isChatOpen ? null : story._id
                          )
                        }
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-3"
                      >
                        🤖 Ask AI about this journey
                      </button>

                      {/* Chatbot */}
                      {isChatOpen && (
                        <div className="border-t pt-4 mt-2">
                          <StoryChatbot storyId={story._id} />
                        </div>
                      )}

                      {/* User Info */}
                      <div className="mt-auto pt-4 border-t flex items-center gap-3">
                        <img
                          src={user?.avatar || "/default-avatar.png"}
                          alt={user?.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-gray-500">Explorer</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-4 mb-28">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-5 py-2 bg-white border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 bg-white border rounded-lg font-bold">
                Page {page}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Stories;
