const WISHLIST_KEY = 'wishlist';

export const getWishlist = () => {
  const stored = localStorage.getItem(WISHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToWishlist = (bookId) => {
  const wishlist = getWishlist();
  if (!wishlist.includes(bookId)) {
    wishlist.push(bookId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (bookId) => {
  const wishlist = getWishlist().filter(id => id !== bookId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};
