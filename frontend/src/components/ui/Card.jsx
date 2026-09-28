import React from "react";

export const Card = ({
  children,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <div
      className={`hh-card ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
