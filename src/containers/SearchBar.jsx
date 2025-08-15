import React, { useState, useEffect } from "react";
import styles from "../styles/SearchBar.module.css";

function SearchBar({ onSearch }) {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");

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
      onSearch(debouncedText);
    }
  }, [debouncedText, onSearch]);

  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search for a city..."
        value={text}
        onChange={handleInputChange}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
