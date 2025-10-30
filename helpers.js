export function generateModifiedQuery(query) {
  const alphabet = ' abcdefghijklmnopqrstuvwsyz';
  const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${query} ${randomLetter}`;
}