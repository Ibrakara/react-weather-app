import React from "react";
import Header from "./components/Header";
import { Outlet, Link } from "react-router-dom";

function App() {
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
}

export default App;
