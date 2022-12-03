import React from "react";
import { AlertType } from "src/types";
import "./Alert.css";

interface AlertProps {
  /**
   * Message to be shown
   */
  message: string;
  /**
   * Action when clicked
   * Eg: close the alert
   */
  onClick: () => void;
  /**
   * Changes the style of the alert. Can be 'success' or 'error'
   * @default success
   */
  type?: AlertType;
}

const Alert: React.FC<AlertProps> = ({
  message,
  onClick,
  type = "success",
}) => {
  return (
    <div
      className={`alert_box ${
        type === "success" ? "alert_box_green" : "alert_box_red"
      }`}
      onClick={onClick}
    >
      <p className="p_default_text">{message}</p>
    </div>
  );
};

export default Alert;
