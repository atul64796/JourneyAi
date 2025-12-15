import axios from "axios";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

export const getUnsplashImagesService = async ({
  query,
  count = 5,
}) => {
  try {
    const response = await axios.get(
      `${UNSPLASH_BASE_URL}/search/photos`,
      {
        params: {
          query,
          per_page: count,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.data.results.length) return [];

    return response.data.results.map((img) => ({
      imageUrl: img.urls.regular,
      attribution: `Photo by ${img.user.name} on Unsplash`,
    }));
  } catch (error) {
    console.error("Unsplash Error:", error.message);
    return [];
  }
};



