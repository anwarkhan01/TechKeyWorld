const generateKeywords = (...values) => {
  const all = values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);

  return [...new Set(all)];
};

export default generateKeywords;
