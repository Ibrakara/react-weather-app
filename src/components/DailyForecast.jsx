import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/DailyForecast.module.css";
import WeatherIcon from "./WeatherIcon";

const DailyForecast = ({ data, locationName }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={styles.forecastContainer}>
      {data.map((day) => (
        <Link
          to={`/detail/${locationName}-${day.urlDate}`}
          key={`${locationName}-${day.urlDate}`}
          className={styles.dayLink}
        >
          <div className={styles.dayCard}>
            <p className={styles.date}>{day.date}</p>
            <WeatherIcon
              iconCode={day.icon}
              size={20}
              className={styles.icon}
            />
            <div className={styles.temps}>
              <span className={styles.minTemp}>
                {day.min}° - {day.max}°
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DailyForecast;
