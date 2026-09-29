/**
 * Helper to transform and optimize image URLs with appropriate width and format parameters
 * for ImageKit and Unsplash CDNs.
 */
export const optimizeImageUrl = (url, width = 720) => {
  if (!url || typeof url !== "string") return url;

  try {
    if (url.includes("ik.imagekit.io")) {
      if (url.includes("?tr=") || url.includes("&tr=")) return url;
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}tr=w-${width},f-auto`;
    }

    if (url.includes("images.unsplash.com")) {
      if (url.includes("w=") && url.includes("auto=format")) return url;
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", width.toString());
      urlObj.searchParams.set("q", "80");
      urlObj.searchParams.set("auto", "format");
      return urlObj.toString();
    }
  } catch (err) {
    return url;
  }

  return url;
};

export default optimizeImageUrl;
