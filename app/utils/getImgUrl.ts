export const getImageUrl = (imageUrl: string) => {
  if (!imageUrl)
    return "https://cdn-icons-png.flaticon.com/512/5787/5787100.png";
  if (imageUrl.startsWith("http://localhost")) {
    const relative = imageUrl.split("/uploads/")[1];
    return `${process.env.EXPO_PUBLIC_API_URL}/uploads/${relative}`;
  }
  if (!imageUrl.startsWith("http")) {
    return `${process.env.EXPO_PUBLIC_API_URL}/${imageUrl}`;
  }
  return imageUrl;
};
