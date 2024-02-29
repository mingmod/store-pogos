const prefixes: string[] = [
  "John",
  "Emily",
  "Michael",
  "Sophia",
  "William",
  "Emma",
  "Matthew",
  "Olivia",
  "Daniel",
  "Ava",
  "Alexander",
  "Mia",
  "Ethan",
  "Isabella",
  "James",
  "Charlotte",
  "David",
  "Abigail",
  "Jacob",
  "Harper",
];
const suffixes: string[] = [
  "Smith",
  "Johnson",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Martinez",
  "Jackson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Hernandez",
  "Moore",
  "Martin",
  "Thompson",
  "White",
  "Lopez",
  "Lee",
  "Walker",
];
export const generateRandomName = () => {
  const randomPrefix: string =
    prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix: string =
    suffixes[Math.floor(Math.random() * suffixes.length)];
  return {
    firstName: randomPrefix,
    lastName: randomSuffix,
    fullname: randomPrefix + " " + randomSuffix,
  };
};
