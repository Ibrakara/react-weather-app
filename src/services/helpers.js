export function getDailyForecast(forecastData) {
  const dailyData = {};
  const timezoneOffset = forecastData.city.timezone;

  forecastData.list.forEach((entry) => {
    const localTimestamp = (entry.dt + timezoneOffset) * 1000;
    const date = new Date(localTimestamp).toLocaleDateString("en-GB");

    const temp = entry.main.temp;
    const description = entry.weather[0].description;

    if (!dailyData[date]) {
      dailyData[date] = {
        min: temp,
        max: temp,
        descriptions: new Set([description]),
      };
    } else {
      dailyData[date].min = Math.min(dailyData[date].min, temp);
      dailyData[date].max = Math.max(dailyData[date].max, temp);
      dailyData[date].descriptions.add(description);
    }
  });

  return Object.keys(dailyData).map((date) => ({
    date,
    min: dailyData[date].min,
    max: dailyData[date].max,
    description: Array.from(dailyData[date].descriptions).join(", "),
  }));
}
