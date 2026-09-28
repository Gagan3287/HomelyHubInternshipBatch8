import React from "react";

export const Badge = ({
  children,
  variant = "primary", // "primary" | "muted" | "success" | "warning" | "error"
  className = "",
  ...props
}) => {
  return (
    <span className={`hh-badge hh-badge-${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
};

export default Badge;
