export function getDailyForecast(forecastData) {
  const dailyData = {};
  const timezoneOffset = forecastData.city.timezone;

  forecastData.list.forEach((entry) => {
    const dateObj = new Date((entry.dt + timezoneOffset) * 1000);
    const date = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    });
    const urlDate = `${dateObj.getUTCFullYear()}-${String(
      dateObj.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(2, "0")}`;

    const hour = dateObj.getUTCHours();

    const temp = entry.main.temp;
    const description = entry.weather[0].description;
    const icon = entry.weather[0].icon;

    if (!dailyData[date]) {
      dailyData[date] = {
        min: temp,
        max: temp,
        descriptions: new Set([description]),
        icon: icon,
        urlDate,
      };
    } else {
      dailyData[date].min = Math.min(dailyData[date].min, temp);
      dailyData[date].max = Math.max(dailyData[date].max, temp);
      dailyData[date].descriptions.add(description);
    }
    if (hour >= 12 && hour < 15) {
      dailyData[date].icon = icon;
    }
  });

  return Object.keys(dailyData).map((date) => ({
    date,
    min: Math.round(dailyData[date].min),
    max: Math.round(dailyData[date].max),
    description: Array.from(dailyData[date].descriptions).join(", "),
    icon: dailyData[date].icon,
    urlDate: dailyData[date].urlDate,
  }));
}
