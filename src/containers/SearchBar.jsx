import React, { useState, useEffect } from "react";
import styles from "../styles/SearchBar.module.css";
import { useSelector } from "react-redux";

function SearchBar({
  onSearch,
  placeholder = "Search for a city...",
  value,
  onChange,
}) {
  const [debouncedText, setDebouncedText] = useState("");
  const searchedLocations = useSelector(
    (state) => state.location.searchedLocations
  );

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(value);
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    onSearch(debouncedText);
  }, [debouncedText]);

  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
