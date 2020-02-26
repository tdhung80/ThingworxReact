import React, { useState } from "react";
import classNames from "classnames";

let counter = 0;

export const FieldSelect = React.forwardRef(
  ({ name, label, required = false, placeholder, errorMessage, onBlur, onFocus, ...props }, ref) => {
    const id = `fs_${name}_${counter++}`;
    const [focused, setFocused] = useState();
    const [filled, setFilled] = useState();
    props = {
      ...props,
      name,
      id,
      className: "form-control",
      onBlur: e => {
        setFocused(false);
        setFilled(e.target.value.trim() !== "");
        onBlur && onBlur(e);
      },
      onFocus: e => {
        setFocused(true);
        onFocus && onFocus(e);
      },
      ref
    };
    // custom-select
    return (
      <div className={classNames("form-group", "bmd-form-group", { "is-focused": focused }, { "is-filled": filled })}>
        <label htmlFor={id} className={classNames("bmd-label-static", { invisible: !label, required: required })}>
          {label}
        </label>
        <select {...props}>{props.children}</select>
        {placeholder && <small className="form-text text-muted">{placeholder}</small>}
        {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
      </div>
    );
  }
);
