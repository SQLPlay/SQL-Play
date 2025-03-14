export const capitalizeWord = (str: string) => {
  const chars = str.split('');
  chars[0] = chars[0].toUpperCase();
  return chars.join('');
};
