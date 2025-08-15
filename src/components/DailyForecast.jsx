import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/DailyForecast.module.css";
import ForecastCard from "./ForecastCard";

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
          <ForecastCard
            key={day.date}
            dateString={day.date}
            iconCode={day.icon}
            temp={`${day.min}° - ${day.max}°`}
          />
        </Link>
      ))}
    </div>
  );
};

export default DailyForecast;
