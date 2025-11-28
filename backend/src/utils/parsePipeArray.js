const parsePipeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
};

export default parsePipeArray;
