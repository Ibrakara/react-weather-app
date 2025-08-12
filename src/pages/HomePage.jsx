import React from "react";
import SearchBar from "../components/SearchBar";

function HomePage() {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Add your search logic here
  };
  return (
    <>
      <SearchBar onSearch={handleSearch} />
    </>
  );
}

export default HomePage;
