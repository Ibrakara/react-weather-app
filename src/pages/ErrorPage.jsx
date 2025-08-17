import React from "react";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/ErrorPage.module.css";
import { Link } from "react-router-dom";

const ErrorPage = ({
  errorCode = "404",
  message = "Page not found. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
}) => {
  return (
    <div className={styles.errorPageContainer}>
      <h1 className={styles.errorCode}>{errorCode}</h1>
      <h2 className={styles.errorTitle}>Oops! Something went wrong.</h2>
      <ErrorMessage message={message} />
      <Link to="/" className={styles.homeLink}>
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
