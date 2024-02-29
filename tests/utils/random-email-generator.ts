const domains: string[] = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
];

export const generateRandomEmail = (prefix: string): string => {
  const randomDomain: string =
    domains[Math.floor(Math.random() * domains.length)];

  const randomNumber = Math.floor(Math.random() * 10000);
  const randomEmail: string = `${prefix.toLowerCase()}.${randomNumber}@${randomDomain}`;
  return randomEmail;
};
