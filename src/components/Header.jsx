import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { setLanguage } from "../store/slices/languageSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "../styles/Header.module.css";
import CustomButton from "./CustomButton";
import "flag-icons/css/flag-icons.min.css";

function Header() {
  const theme = useSelector((state) => state.theme.mode);
  const currentLanguage = useSelector((state) => state.language.language);

  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = (language) => {
    dispatch(setLanguage(language));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Weather App</h1>
      <div className={styles.actions}>
        <CustomButton onClick={handleThemeToggle} title="Toggle Theme">
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </CustomButton>
        <div className={styles.languageButtonContainer}>
          <CustomButton
            onClick={() => handleLanguageChange("en")}
            title="Change to English"
            className={currentLanguage === "en" ? styles.active : ""}
          >
            <span className="fi fi-gb"></span>
          </CustomButton>
          <CustomButton
            onClick={() => handleLanguageChange("es")}
            title="Change to Spanish"
            className={currentLanguage === "es" ? styles.active : ""}
          >
            <span className="fi fi-es"></span>
          </CustomButton>
        </div>
      </div>
    </header>
  );
}

export default Header;
