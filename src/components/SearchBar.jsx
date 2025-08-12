import React, { useState, useEffect } from "react";
import styles from "../styles/SearchBar.module.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={handleInputChange}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
