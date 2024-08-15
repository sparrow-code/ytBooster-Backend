const formatNumber = (count = 0) => {
  const abbreviations = ["K", "M", "B", "T"];

  let formattedCount = count.toString();

  if (count >= 10000) {
    const abbreviationIndex = Math.floor(Math.log10(count) / 3);
    const abbreviatedCount =
      Math.floor((count / Math.pow(1000, abbreviationIndex)) * 10) / 10;
    formattedCount = `${abbreviatedCount}${
      abbreviations[abbreviationIndex - 1]
    }`;
  }

  return formattedCount;
};

export { formatNumber };
