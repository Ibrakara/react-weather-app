import React from "react";
import styles from "../styles/HourlyForecast.module.css";
import WeatherIcon from "./WeatherIcon";
import { Link } from "react-router-dom";

const HourlyForecast = ({ data, locationName, date, timezoneOffset }) => {
  if (!data || data.length === 0) {
    return <p>No detailed forecast available for this day.</p>;
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
        {data.map((item) => {
          const localTimestamp = (item.dt + timezoneOffset) * 1000;
          const time = new Date(localTimestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
          });

          return (
            <div key={item.dt} className={styles.item}>
              <p className={styles.time}>{time}</p>
              <WeatherIcon
                iconCode={item.weather[0].icon}
                size={40}
                className={styles.icon}
              />
              <p className={styles.temp}>{Math.round(item.main.temp)}°C</p>
              <p className={styles.description}>
                {item.weather[0].description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
