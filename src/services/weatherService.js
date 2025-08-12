import axios from "axios";
import { BASE_URL } from "../constants/index.js";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // store in .env

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
export const getWeeklyForecast = async (lat, lon, units = "metric") => {
  try {
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat,
        lon,
        exclude: "hourly,minutely",
        units,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly forecast:", error);
    throw error;
  }
};

export const getWeatherByCoords = async (lat, lon, units = "metric") => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
};
