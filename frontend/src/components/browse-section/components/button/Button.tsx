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
}

/**
 * A simple button
 */
export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  isDisabled,
  title,
}) => {
  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      className={`button ${isDisabled ? "button_disabled" : "button_active"}`}
    >
      {title}
    </button>
  );
};
