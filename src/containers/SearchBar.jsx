import React, { useState, useEffect } from "react";
import styles from "../styles/SearchBar.module.css";
import { useSelector } from "react-redux";

function SearchBar({ onSearch, placeholder = "Search for a city..." }) {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const searchedLocations = useSelector(
    (state) => state.location.searchedLocations
  );

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    if (debouncedText.trim()) {
      if (searchedLocations?.includes(debouncedText)) {
        return;
      }
      onSearch(debouncedText);
      setText("");
    }
  }, [debouncedText, searchedLocations]);

  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleInputChange}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
