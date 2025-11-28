const generateKeywords = (...values) => {
  const baseWords = values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);

  const set = new Set();

  baseWords.forEach((word) => {
    set.add(word);

    if (word.length > 3) set.add(word.slice(0, 3));

    if (word.length > 4) set.add(word.slice(0, 2));

    if (word === "microsoft") set.add("ms");
    if (word === "windows") set.add("win");
    if (word === "office") set.add("ofc");
  });

  return [...set];
};

export default generateKeywords;
