import React from "react";
import styles from "../styles/ErrorMessage.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <FaExclamationTriangle className={styles.errorIcon} />
      <p className={styles.errorMessage}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
