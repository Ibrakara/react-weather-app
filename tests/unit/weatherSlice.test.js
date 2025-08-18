import { configureStore } from '@reduxjs/toolkit';
import weatherReducer, { setCurrentWeather, setForecastList } from '@src/store/slices/weatherSlice';

describe('weatherSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        weather: weatherReducer,
      },
    });
  });

  it('should return the initial state', () => {
    expect(store.getState().weather.currentWeather).toBeNull();
    expect(store.getState().weather.forecastList).toEqual([]);
  });

  it('should handle setCurrentWeather', () => {
    const weatherData = { temperature: 25, condition: 'Sunny' };
    store.dispatch(setCurrentWeather(weatherData));
    expect(store.getState().weather.currentWeather).toEqual(weatherData);
  });

  it('should handle setForecastList', () => {
    const forecastData = [{ day: 'Mon', temp: 20 }, { day: 'Tue', temp: 22 }];
    store.dispatch(setForecastList(forecastData));
    expect(store.getState().weather.forecastList).toEqual(forecastData);
  });
});