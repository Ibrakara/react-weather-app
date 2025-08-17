import React, { memo } from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiDayRain,
  WiNightAltRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiNa,
} from "react-icons/wi";
import styles from "../styles/WeatherIcon.module.css";

const iconMap = {
  "01d": WiDaySunny,
  "01n": WiNightClear,
  "02d": WiDayCloudy,
  "02n": WiNightAltCloudy,
  "03d": WiCloud,
  "03n": WiCloud,
  "04d": WiCloudy,
  "04n": WiCloudy,
  "09d": WiShowers,
  "09n": WiShowers,
  "10d": WiDayRain,
  "10n": WiNightAltRain,
  "11d": WiThunderstorm,
  "11n": WiThunderstorm,
  "13d": WiSnow,
  "13n": WiSnow,
  "50d": WiFog,
  "50n": WiFog,
};

const WeatherIcon = ({ iconCode, className, ...props }) => {
  const IconComponent = iconMap[iconCode] || WiNa;
  const iconClassName = `${styles.weatherIcon} ${className || ""}`;

  return <IconComponent className={iconClassName} {...props} />;
};

export default memo(WeatherIcon);
