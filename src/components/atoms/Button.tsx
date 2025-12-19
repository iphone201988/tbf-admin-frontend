import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn edit",
  secondary: "btn cancel",
  ghost: "btn",
  link: "btn",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...rest
}) => {
  const combined = [variantClass[variant], className].filter(Boolean).join(" ");
  return (
    <button className={combined} {...rest}>
      {children}
    </button>
  );
};

export default Button;

