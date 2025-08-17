import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setGeoLocation,
  setGeoLocationError,
} from "./store/slices/locationSlice";
import Header from "./containers/Header";
import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(
              setGeoLocation({
                latitude: latitude.toFixed(2),
                longitude: longitude.toFixed(2),
              })
            );
          },
          (error) => {
            dispatch(setGeoLocationError(error.message));
            console.log(error.message);
          }
        );
      } else {
        dispatch(
          setGeoLocationError("Geolocation is not supported by this browser.")
        );
      }
    };

    fetchLocation();
  }, []);

  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

export default App;
