import { PropsWithChildren } from "react";
import "./Button.css";

interface ButtonProps {
  /**
   * The text shown on the button
   */
  title: string;
  /**
   * Action when clicked
   */
  onClick?: () => void;
  /**
   * Disabled the button
   */
  isDisabled?: boolean;
  /**
   * Turns the button in a loading button
   */
  isLoading?: boolean;
}

/**
 * A simple button
 */
export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  isDisabled,
  isLoading,
  title,
}) => {
  return (
    <button
      onClick={!isDisabled && !isLoading ? onClick : undefined}
      className={`button ${isDisabled ? "button_disabled" : "button_active"} ${
        isLoading ? "button_loading" : ""
      }`}
    >
      {/* <p className={isLoading ? "button_loading" : ""}>{title}</p> */}
      {title}
    </button>
  );
};
