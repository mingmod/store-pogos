const generateRandomPrice = (): number => {
  const minPrice = 100; // $1 in cents
  const maxPrice = 5000; // $50 in cents
  return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
};
