import axios from "axios";
import { BASE_URL } from "../constants/index.js";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getCurrentWeather = async (city, lat, lon, units = "metric") => {
  try {
    const params = {
      units,
      appid: API_KEY,
    };
    if (city) {
      params.q = city;
    } else if (lat !== null && lon !== null) {
      params.lat = lat;
      params.lon = lon;
    } else {
      return null;
    }
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching current weather for city: ${city}, lat: ${lat}, lon: ${lon}`,
      error
    );
    throw error;
  }
};
export const getThreeHourlyForecast = async (lat, lon, units = "metric") => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        exclude: "hourly,minutely",
        appid: API_KEY,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching 3-hourly forecast for lat: ${lat}, lon: ${lon}`,
      error
    );
    throw error;
  }
};
