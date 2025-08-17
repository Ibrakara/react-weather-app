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

const WeatherIcon = ({ iconCode, ...props }) => {
  const iconMap = {
    "01d": <WiDaySunny {...props} />,
    "01n": <WiNightClear {...props} />,
    "02d": <WiDayCloudy {...props} />,
    "02n": <WiNightAltCloudy {...props} />,
    "03d": <WiCloud {...props} />,
    "03n": <WiCloud {...props} />,
    "04d": <WiCloudy {...props} />,
    "04n": <WiCloudy {...props} />,
    "09d": <WiShowers {...props} />,
    "09n": <WiShowers {...props} />,
    "10d": <WiDayRain {...props} />,
    "10n": <WiNightAltRain {...props} />,
    "11d": <WiThunderstorm {...props} />,
    "11n": <WiThunderstorm {...props} />,
    "13d": <WiSnow {...props} />,
    "13n": <WiSnow {...props} />,
    "50d": <WiFog {...props} />,
    "50n": <WiFog {...props} />,
  };

  return iconMap[iconCode] || <WiNa {...props} />;
};

export default memo(WeatherIcon);
