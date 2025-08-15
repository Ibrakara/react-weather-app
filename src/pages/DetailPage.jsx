import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import HourlyForecast from "../components/HourlyForecast";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../services/helpers";
import { useWeeklyForecast } from "../hooks/useForecastList";

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

  return (
    <HourlyForecast
      data={detailedDayData}
      locationName={locationName}
      date={date}
      timezoneOffset={forecastData.city.timezone}
    />
  );
};

export default DetailPage;
