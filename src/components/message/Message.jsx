import { useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import styles from "./Message.module.css";

const Message = ({ message, type, onClose }) => {
  // Automatically hide the message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose(); // Hide message after 5 seconds
      }, 5000);
      return () => clearTimeout(timer); // Clean up the timer if message is removed
    }
  }, [message, onClose]);

  const getClassName = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "info":
        return styles.info;
      default:
        return styles.message;
    }
  };

  return (
    message && (
      <div className={getClassName()}>
        <span>{message}</span>
        <button onClick={onClose} className={styles.closeBtn}>
          X
        </button>
      </div>
    )
  );
};

// PropTypes validation
Message.propTypes = {
  message: PropTypes.string.isRequired,  // 'message' should be a string and required
  type: PropTypes.oneOf(["success", "error", "info"]).isRequired, // 'type' should be one of 'success', 'error', or 'info'
  onClose: PropTypes.func.isRequired, // 'onClose' should be a function and required
};

export default Message;
