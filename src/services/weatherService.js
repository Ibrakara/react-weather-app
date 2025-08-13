import axios from "axios";
import { BASE_URL } from "../constants/index.js";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getCurrentWeather = async (city, units = "metric") => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};
export const getWeeklyForecast = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        exclude: "hourly,minutely",
        appid: API_KEY,
      },
    });
    console.log(
      "Weekly forecast data:",
      new Date(response.data.list[0].dt),
      response.data.list[0].dt
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly forecast:", error);
    throw error;
  }
};
