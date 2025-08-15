import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ForecastCard from "../components/ForecastCard";
import { getErrorMessage } from "../services/helpers";
import { useWeeklyForecast } from "../hooks/useForecastList";
import styles from "../styles/DetailPage.module.css";

const DetailPage = () => {
  const { locationDate } = useParams();

  const date = locationDate.split("-").slice(1).join("-");
  const locationName = locationDate.split("-")[0];
  const {
    data: forecastData,
    isLoading,
    error,
  } = useWeeklyForecast(null, null, locationName, false);

  const detailedDayData = useMemo(() => {
    if (!forecastData) return [];
    return forecastData.list.filter((item) => {
      const itemDate = new Date((item.dt + forecastData.city.timezone) * 1000)
        .toISOString()
        .slice(0, 10);
      return itemDate === date;
    });
  }, [forecastData, date]);

  if (isLoading) {
    return <p>Loading details...</p>;
  }

  if (error) {
    const errorMessage = getErrorMessage(error, null);
    return <ErrorMessage message={errorMessage} />;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{locationName}</h2>
      <h3 className={styles.date}>{formattedDate}</h3>
      <Link to="/" className={styles.backLink}>
        &larr; Back to Overview
      </Link>
      <div className={styles.list}>
        {detailedDayData.map((item) => {
          return (
            <ForecastCard
              key={item.dt}
              dateString={new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              iconCode={item.weather[0].icon}
              temp={Math.round(item.main.temp)}
              description={item.weather[0].description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DetailPage;
