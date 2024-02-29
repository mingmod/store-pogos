// Array of farm products
const farmProducts = [
  "Apples",
  "Oranges",
  "Bananas",
  "Carrots",
  "Potatoes",
  "Tomatoes",
  "Lettuce",
  "Cucumbers",
  "Eggs",
  "Milk",
  "Cheese",
  "Chicken",
  "Beef",
  "Pork",
  "Honey",
  "Wheat",
  "Corn",
  "Oats",
  "Rice",
  "Strawberries",
];

const generateRandomProductNames = (count: number) => {
  const randomProducts = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * farmProducts.length);
    randomProducts.push(farmProducts[randomIndex]);
  }
  return randomProducts;
};
