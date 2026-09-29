import React from "react";

export const Input = React.forwardRef(({
  label,
  error,
  type = "text",
  className = "",
  id,
  rows,
  ...props
}, ref) => {
  const isTextarea = type === "textarea";
  const InputComponent = isTextarea ? "textarea" : "input";
  const errorClass = error ? "hh-input--error" : "";

  return (
    <div className="hh-field">
      {label && (
        <label htmlFor={id} className="hh-label">
          {label}
        </label>
      )}
      <InputComponent
        ref={ref}
        id={id}
        type={isTextarea ? undefined : type}
        rows={isTextarea ? rows || 3 : undefined}
        className={`hh-input ${errorClass} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />
      {error && <span id={id ? `${id}-error` : undefined} className="hh-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
