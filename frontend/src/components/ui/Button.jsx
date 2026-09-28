import React from "react";

export const Button = ({
  children,
  variant = "primary", // "primary" | "secondary" | "ghost" | "danger"
  size = "md", // "sm" | "md"
  isLoading = false,
  isDisabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const loadingClass = isLoading ? "btn-loading" : "";

  return (
    <button
      type={type}
      className={`btn-hh ${variantClass} ${sizeClass} ${loadingClass} ${className}`.trim()}
      disabled={isDisabled || isLoading}
      aria-disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
