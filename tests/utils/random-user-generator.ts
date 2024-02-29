import { generateRandomEmail } from "./random-email-generator";
import { generateRandomName } from "./random-name-generator";

export const generateRandomUser = () => {
  const { firstName, fullname } = generateRandomName();
  const email = generateRandomEmail(firstName);
  return { name: fullname, email };
};
