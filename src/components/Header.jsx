import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoMdFlag } from "react-icons/io"; // Example flag icons
import styles from "../styles/Header.module.css";
import CustomButton from "./CustomButton";

function Header() {
  const isThemeLight = useSelector((state) => state.theme.isThemeLight);
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = (language) => {
    alert(`Language changed to ${language}`);
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
        <CustomButton onClick={handleThemeToggle} title="Toggle Theme">
          {isThemeLight ? <FaMoon /> : <FaSun />}
        </CustomButton>
        <CustomButton
          onClick={() => handleLanguageChange("English")}
          title="Change to English"
        >
          <IoMdFlag style={{ color: "blue" }} /> {/* Example English flag */}
        </CustomButton>
        <CustomButton
          onClick={() => handleLanguageChange("Spanish")}
          title="Change to Spanish"
        >
          <IoMdFlag style={{ color: "red" }} /> {/* Example Spanish flag */}
        </CustomButton>
      </div>
    </header>
  );
}

export default Header;
