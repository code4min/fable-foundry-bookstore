const CART_KEY = 'cart';

export const getCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (bookId) => {
  const cart = getCart();
  if (!cart.includes(bookId)) {
    cart.push(bookId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const removeFromCart = (bookId) => {
  const cart = getCart().filter(id => id !== bookId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
