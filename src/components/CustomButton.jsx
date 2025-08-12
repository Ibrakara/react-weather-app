import React from "react";
import styles from "../styles/CustomButton.module.css";

function CustomButton({ onClick, children, title }) {
  return (
    <button className={styles.customButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export default CustomButton;
