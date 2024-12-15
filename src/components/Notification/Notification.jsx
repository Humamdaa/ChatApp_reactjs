// components/notification/Notification.js

import { useState, useEffect } from "react";
import styles from "./Notification.module.css"; // You will need to create styles for this component

const Notification = ({ message, senderName, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null; // Don't render if the notification is not visible

  return (
    <div className={styles.notification}>
      <strong>{senderName}:</strong> {message}
    </div>
  );
};

export default Notification;
