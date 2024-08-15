function queryByTime(time) {
  let dateQuery = {};
  const today = new Date();
  if (time.option === "Today") {
    dateQuery = {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  } else if (time.option === "Yesterday") {
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    dateQuery = {
      $gte: new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
      ),
    };
  } else if (time.option === "Week") {
    let lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    dateQuery = { $gte: lastWeek };
  } else if (time.option === "Month") {
    let lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    dateQuery = { $gte: lastMonth };
  } else if (time.option === "Year") {
    let lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    dateQuery = { $gte: lastYear };
  } else if (time.option === "Custom") {
    dateQuery = {
      $gte: new Date(time.startDate),
      $lte: new Date(time.endDate),
    };
  }

  return dateQuery;
}

export { queryByTime };
