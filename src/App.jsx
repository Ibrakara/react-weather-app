import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocation, setLocationError } from "./store/slices/locationSlice";
import Header from "./components/Header";
import { Outlet, Link } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude);
            dispatch(setLocation({ latitude, longitude }));
          },
          (error) => {
            dispatch(setLocationError(error.message));
            console.log(error.message);
          }
        );
      } else {
        dispatch(
          setLocationError("Geolocation is not supported by this browser.")
        );
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      <Header />
      <Link to="/">Home</Link> | <Link to="/detail/1">Details</Link>
      <main>
        <h1>Weather App</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
