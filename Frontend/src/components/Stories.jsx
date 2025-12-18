import { useEffect, useState } from "react";
import { getPublicStories } from "../services/storyServices";
import Footer from "./Footer";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  useEffect(() => {
    loadStories();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gray-50 py-12  ">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          🌍 Public Stories
        </h2>
        <p className="mt-3 text-lg text-gray-500">
          Explore shared journeys and experiences from around the globe.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 ">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading amazing stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <p className="text-gray-500 text-xl">No public stories available yet.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Responsive Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => {
              const user = story.userId;
              const isExpanded = expandedStoryId === story._id;

              return (
                <article 
                  key={story._id} 
                  className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-56 w-full">
                    {story.imageUrl ? (
                      <img
                        src={story.imageUrl}
                        alt={story.destination}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-300">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider shadow-sm">
                      {story.mood}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {story.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {story.destination}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {isExpanded
                        ? story.storyText
                        : story.storyText.length > 150
                        ? `${story.storyText.slice(0, 150)}...`
                        : story.storyText}
                    </p>

                    {story.storyText.length > 150 && (
                      <button
                        onClick={() => setExpandedStoryId(isExpanded ? null : story._id)}
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors text-left mb-6"
                      >
                        {isExpanded ? "Show Less ▲" : "Read Full Story ▼"}
                      </button>
                    )}

                    {/* Footer / User Info */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                      <img
                        src={user?.avatar || "/default-avatar.png"}
                        alt={user?.fullName}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{user?.fullName}</span>
                        <span className="text-xs text-gray-500">Explorer</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-4 mb-28">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-gray-500 text-sm">Page</span>
              <span className="mx-2 font-bold text-blue-600">{page}</span>
            </div>
            <button
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Next
            </button>
          </div>
          
        </div>
      )}
      
    </div>
    <Footer/>
    </>
  );
};

export default Stories;