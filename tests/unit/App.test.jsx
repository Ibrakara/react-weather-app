import React from "react";
import { render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "@src/App";
import {
  setGeoLocation,
  setGeoLocationError,
} from "@src/store/slices/locationSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe("App", () => {
  const dispatch = jest.fn();

  let consoleLogSpy;

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReturnValue("mockedValue");
    dispatch.mockClear();
    navigator.geolocation.getCurrentPosition.mockClear();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  test("dispatches setGeoLocation on successful geolocation", () => {
    const mockPosition = {
      coords: { latitude: 34.052235, longitude: -118.243683 },
    };
    navigator.geolocation.getCurrentPosition.mockImplementationOnce(
      (successCallback) => successCallback(mockPosition)
    );

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      setGeoLocation({ latitude: "34.05", longitude: "-118.24" })
    );
  });

  test("dispatches setGeoLocationError on geolocation error", () => {
    const mockError = { message: "User denied Geolocation" };
    navigator.geolocation.getCurrentPosition.mockImplementationOnce(
      (successCallback, errorCallback) => errorCallback(mockError)
    );

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      setGeoLocationError("User denied Geolocation")
    );
  });

  test("dispatches setGeoLocationError if geolocation is not supported", () => {
    Object.defineProperty(global, "navigator", {
      value: { geolocation: undefined },
      writable: true,
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(dispatch).toHaveBeenCalledWith(
      setGeoLocationError("Geolocation is not supported by this browser.")
    );
  });
});