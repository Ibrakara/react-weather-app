import axios from "axios";
import { BASE_URL } from "../../../src/constants";

const API_KEY = "mock-api-key";

export const getCurrentWeather = jest.fn(
  async (city, lat, lon, units = "metric") => {
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
  }
);

export const getThreeHourlyForecast = jest.fn(
  async (city, lat, lon, units = "metric") => {
    try {
      const params = {
        units,
        appid: API_KEY,
        exclude: "minutely,hourly",
      };
      if (city) {
        params.q = city;
      } else if (lat !== null && lon !== null) {
        params.lat = lat;
        params.lon = lon;
      } else {
        return null;
      }
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching 3-hourly forecast for lat: ${lat}, lon: ${lon}`,
        error
      );
      throw error;
    }
  }
);
