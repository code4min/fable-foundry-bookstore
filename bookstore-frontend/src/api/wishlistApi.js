import axiosInstance from './axiosInstance';

export const addToWishlist = async (email, bookId) => {
  return axiosInstance.post('/wishlist/add', { email, bookId });
};

export const removeFromWishlist = async (email, bookId) => {
  return axiosInstance.delete('/wishlist/remove', { data: { email, bookId } });
};
