import {
  getDailyForecast,
  loadState,
  saveState,
  getErrorMessage,
} from "./helpers";

describe("getDailyForecast", () => {
  test("should correctly aggregate daily forecast data", () => {
    const forecastData = {
      city: { timezone: 0 },
      list: [
        {
          dt: 1678886400,
          main: { temp: 10 },
          weather: [{ description: "clear sky", icon: "01d" }],
        }, // March 15, 2023 00:00:00 UTC
        {
          dt: 1678897200,
          main: { temp: 12 },
          weather: [{ description: "few clouds", icon: "02d" }],
        }, // March 15, 2023 03:00:00 UTC
        {
          dt: 1678908000,
          main: { temp: 8 },
          weather: [{ description: "clear sky", icon: "01d" }],
        }, // March 15, 2023 06:00:00 UTC
        {
          dt: 1678972800,
          main: { temp: 15 },
          weather: [{ description: "broken clouds", icon: "04d" }],
        }, // March 16, 2023 00:00:00 UTC
        {
          dt: 1678983600,
          main: { temp: 18 },
          weather: [{ description: "light rain", icon: "10d" }],
        }, // March 16, 2023 03:00:00 UTC
      ],
    };

    const result = getDailyForecast(forecastData);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      date: "15/03",
      min: 8,
      max: 12,
      description: "clear sky, few clouds",
      icon: "01d",
      urlDate: "2023-03-15",
    });
    expect(result[1]).toEqual({
      date: "16/03",
      min: 15,
      max: 18,
      description: "broken clouds, light rain",
      icon: "04d",
      urlDate: "2023-03-16",
    });
  });

  test("should handle empty forecast data", () => {
    const forecastData = { city: { timezone: 0 }, list: [] };
    const result = getDailyForecast(forecastData);
    expect(result).toEqual([]);
  });

  test("should handle timezone offset correctly", () => {
    const forecastData = {
      city: { timezone: 3600 }, // +1 hour timezone
      list: [
        {
          dt: 1678886400,
          main: { temp: 10 },
          weather: [{ description: "clear sky", icon: "01d" }],
        }, // March 15, 2023 00:00:00 UTC
      ],
    };
    const result = getDailyForecast(forecastData);
    expect(result[0].date).toBe("15/03"); // Still March 15th in +1 timezone
  });

  test("should correctly set icon if only 12-15 UTC entry exists", () => {
    const forecastData = {
      city: { timezone: 0 },
      list: [
        {
          dt: 1678921200,
          main: { temp: 15 },
          weather: [{ description: "afternoon", icon: "02a" }],
        }, // March 15, 2023 12:00:00 UTC
      ],
    };
    const result = getDailyForecast(forecastData);
    expect(result[0].icon).toBe("02a");
  });
});

describe("loadState", () => {
  const MOCK_STATE = { test: "data" };

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
    console.error.mockRestore();
  });

  test("should load state from localStorage if available", () => {
    localStorage.getItem.mockReturnValue(JSON.stringify(MOCK_STATE));
    expect(loadState()).toEqual(MOCK_STATE);
  });

  test("should return undefined if no state in localStorage", () => {
    localStorage.getItem.mockReturnValue(null);
    expect(loadState()).toBeUndefined();
  });

  test("should return undefined and log error if localStorage is invalid JSON", () => {
    localStorage.getItem.mockReturnValue("invalid json");
    expect(loadState()).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test("should return undefined and log error if localStorage throws error", () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });
    expect(loadState()).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe("saveState", () => {
  const MOCK_STATE = { test: "data" };

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
    console.error.mockRestore();
  });

  test("should save state to localStorage", () => {
    saveState(MOCK_STATE);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "state",
      JSON.stringify(MOCK_STATE)
    );
  });

  test("should log error if localStorage throws error", () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });
    saveState(MOCK_STATE);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe("getErrorMessage", () => {
  test("should return null if no errors", () => {
    expect(getErrorMessage(null, null)).toBeNull();
  });

  test("should return message from cityError response data", () => {
    const cityError = { response: { data: { message: "City not found" } } };
    expect(getErrorMessage(cityError, null)).toBe("City not found");
  });

  test("should return message from forecastError response data", () => {
    const forecastError = {
      response: { data: { message: "Forecast unavailable" } },
    };
    expect(getErrorMessage(null, forecastError)).toBe("Forecast unavailable");
  });

  test("should return message from cityError message property", () => {
    const cityError = { message: "Network issue" };
    expect(getErrorMessage(cityError, null)).toBe("Network issue");
  });

  test("should return message from forecastError message property", () => {
    const forecastError = { message: "Server error" };
    expect(getErrorMessage(null, forecastError)).toBe("Server error");
  });

  test("should return cityError message if both have messages", () => {
    const cityError = { message: "City error" };
    const forecastError = { message: "Forecast error" };
    expect(getErrorMessage(cityError, forecastError)).toBe("City error");
  });

  test("should return unknown error message for generic error object", () => {
    const genericError = {};
    expect(getErrorMessage(genericError, null)).toBe(
      "An unknown error occurred."
    );
  });
});
