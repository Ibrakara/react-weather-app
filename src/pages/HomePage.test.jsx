import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./HomePage";
import { useWeatherAndForecast } from "../hooks/useWeatherAndForecast";
import toast from "react-hot-toast";
import {
  setSearchedLocation,
  addSearchedLocation,
  setCurrentLocation,
} from "../store/slices/locationSlice";

jest.mock("../containers/SearchBar", () => ({
  __esModule: true,
  default: ({ onSearch, onChange, value, placeholder }) => (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button data-testid="search-button" onClick={() => onSearch(value)}>
        Search
      </button>
    </div>
  ),
}));
jest.mock("../components/WeatherCard", () => ({
  __esModule: true,
  default: ({ weatherData, forecastData, isRemovable, searchedName }) => (
    <div data-testid="weather-card">
      {weatherData?.name} - {forecastData?.list?.length} -{" "}
      {isRemovable ? "Removable" : "Not Removable"}
      {searchedName ? ` - ${searchedName}` : ""}
    </div>
  ),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

jest.mock("../hooks/useWeatherAndForecast", () => ({
  useWeatherAndForecast: jest.fn(),
}));

describe("HomePage", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.location.searchedLocations")) {
        return [];
      }
      if (selector.toString().includes("state.location.searchedLocation")) {
        return "NonExistentCity";
      }
      if (selector.toString().includes("state.location.currentLocation")) {
        return null;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return null;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return null;
      }
      return undefined;
    });
    useWeatherAndForecast.mockReturnValue({
      weatherData: null,
      forecastData: null,
      isSuccess: false,
      error: null,
    });
    dispatch.mockClear();
    toast.error.mockClear();
    toast.success.mockClear();
  });

  test("renders SearchBar", () => {
    render(<HomePage />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  test("dispatches setSearchedLocation on search", () => {
    render(<HomePage />);
    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "London" } });
    fireEvent.click(searchButton);

    expect(dispatch).toHaveBeenCalledWith(setSearchedLocation("London"));
  });

  test("displays loading state for current location", () => {
    useSelector.mockImplementation((selector) => {
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return 10;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return 20;
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location, lat, lon) => {
      if (lat === 10 && lon === 20) {
        return {
          isLoading: true,
          weatherData: null,
          forecastData: null,
          isSuccess: false,
          error: null,
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);

    expect(screen.queryByTestId("weather-card")).not.toBeInTheDocument();
  });

  test("displays current location weather card when data is available", () => {
    useSelector.mockImplementation((selector) => {
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return 10;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return 20;
      }
      if (selector.toString().includes("state.location.currentLocation")) {
        return {
          locationName: "currentLocation",
          cityData: { name: "Current City" },
          forecastData: { list: [1, 2, 3] },
        };
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location, lat, lon) => {
      if (lat === 10 && lon === 20) {
        return {
          isLoading: false,
          weatherData: { name: "Current City" },
          forecastData: { list: [1, 2, 3] },
          isSuccess: true,
          error: null,
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(
      screen.getByText("Current City - 3 - Not Removable")
    ).toBeInTheDocument();
  });

  test("displays searched locations weather cards", () => {
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.location.searchedLocations")) {
        return [
          {
            locationName: "London",
            cityData: { name: "London" },
            forecastData: { list: [1, 2] },
          },
          {
            locationName: "Paris",
            cityData: { name: "Paris" },
            forecastData: { list: [1] },
          },
        ];
      }
      return undefined;
    });

    render(<HomePage />);
    expect(
      screen.getByText("London - 2 - Removable - London")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Paris - 1 - Removable - Paris")
    ).toBeInTheDocument();
  });

  test("shows error toast when searched location not found", () => {
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.location.searchedLocations")) {
        return [];
      }
      if (selector.toString().includes("state.location.searchedLocation")) {
        return "NonExistentCity";
      }
      if (selector.toString().includes("state.location.currentLocation")) {
        return null;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return null;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return null;
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location) => {
      if (location === "NonExistentCity") {
        return {
          isLoading: false,
          weatherData: null,
          forecastData: null,
          isSuccess: false,
          error: new Error("City not found"),
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(toast.error).toHaveBeenCalledWith("City not found");
  });

  test("shows error toast when location already exists", () => {
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.location.searchedLocations")) {
        return [
          {
            locationName: "London",
            cityData: { name: "London" },
            forecastData: { list: [1, 2] },
          },
        ];
      }
      if (selector.toString().includes("state.location.searchedLocation")) {
        return "London";
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location) => {
      if (location === "London") {
        return {
          isLoading: false,
          weatherData: { name: "London" },
          forecastData: { list: [1, 2] },
          isSuccess: true,
          error: null,
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(toast.error).toHaveBeenCalledWith("Location already exists");
    expect(dispatch).not.toHaveBeenCalledWith(
      addSearchedLocation(expect.any(Object))
    );
  });

  test("adds new searched location and shows success toast", () => {
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("state.location.searchedLocations")) {
        return [];
      }
      if (selector.toString().includes("state.location.searchedLocation")) {
        return "NewYork";
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location) => {
      if (location === "NewYork") {
        return {
          isLoading: false,
          weatherData: { name: "NewYork" },
          forecastData: { list: [1, 2, 3] },
          isSuccess: true,
          error: null,
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(dispatch).toHaveBeenCalledWith(
      addSearchedLocation({
        locationName: "NewYork",
        cityData: { name: "NewYork" },
        forecastData: { list: [1, 2, 3] },
      })
    );
    expect(toast.success).toHaveBeenCalledWith("Location added successfully");
  });

  test("dispatches setCurrentLocation on successful current location fetch", () => {
    useSelector.mockImplementation((selector) => {
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return 10;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return 20;
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location, lat, lon) => {
      if (lat === 10 && lon === 20) {
        return {
          isLoading: false,
          weatherData: { name: "Current City" },
          forecastData: { list: [1, 2, 3] },
          isSuccess: true,
          error: null,
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(dispatch).toHaveBeenCalledWith(
      setCurrentLocation({
        locationName: "currentLocation",
        cityData: { name: "Current City" },
        forecastData: { list: [1, 2, 3] },
      })
    );
  });

  test("dispatches setSearchedLocation(null) on unmount", () => {
    const { unmount } = render(<HomePage />);
    unmount();
    expect(dispatch).toHaveBeenCalledWith(setSearchedLocation(null));
  });

  test("does not dispatch setCurrentLocation if current location fetch fails", () => {
    useSelector.mockImplementation((selector) => {
      if (
        selector.toString().includes("state.location.geoLocation?.latitude")
      ) {
        return 10;
      }
      if (
        selector.toString().includes("state.location.geoLocation?.longitude")
      ) {
        return 20;
      }
      return undefined;
    });
    useWeatherAndForecast.mockImplementation((location, lat, lon) => {
      if (lat === 10 && lon === 20) {
        return {
          isLoading: false,
          weatherData: null,
          forecastData: null,
          isSuccess: false,
          error: new Error("Geolocation error"),
        };
      }
      return {
        isLoading: false,
        weatherData: null,
        forecastData: null,
        isSuccess: false,
        error: null,
      };
    });

    render(<HomePage />);
    expect(dispatch).not.toHaveBeenCalledWith(
      setCurrentLocation(expect.any(Object))
    );
  });
});
