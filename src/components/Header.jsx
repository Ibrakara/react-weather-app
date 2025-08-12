import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { FaMoon, FaSun, FaGlobe } from "react-icons/fa";
import styles from "../styles/Header.module.css";
import IconButton from "./IconButton";

function Header() {
  const isThemeLight = useSelector((state) => state.theme.isThemeLight);
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = () => {
    alert("Language change functionality not implemented yet!");
  };

  useEffect(() => {
    if (isThemeLight) {
      document.documentElement.setAttribute("data-theme-light", isThemeLight);
    } else {
      document.documentElement.removeAttribute("data-theme-light");
    }
  }, [isThemeLight]);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Weather App</h1>
      <div className={styles.actions}>
        <IconButton onClick={handleThemeToggle} title="Toggle Theme">
          {isThemeLight ? <FaMoon /> : <FaSun />}
        </IconButton>
        <IconButton onClick={handleLanguageChange} title="Change Language">
          <FaGlobe />
        </IconButton>
      </div>
    </header>
  );
}

export default Header;
