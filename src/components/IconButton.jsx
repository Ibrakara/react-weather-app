import React from "react";
import styles from "../styles/IconButton.module.css";

function IconButton({ onClick, children, title }) {
  return (
    <button className={styles.iconButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export default IconButton;
