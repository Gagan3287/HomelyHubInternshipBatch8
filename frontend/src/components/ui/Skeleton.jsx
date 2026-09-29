import React from "react";

export const Skeleton = ({
  variant = "text", // "text" | "heading" | "image"
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantClass = `hh-skeleton-${variant}`;
  const inlineStyles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`hh-skeleton ${variantClass} ${className}`.trim()}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
