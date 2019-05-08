import React, { useState } from "react";
import classNames from "classnames";

let counter = 0;

export const FieldInput = React.forwardRef(
  (
    {
      name,
      label,
      type = "text",
      value,
      placeholder,
      required = false,
      maxLength = 255,
      errorMessage,
      floating,
      onBlur,
      onFocus,
      children,
      ...props
    },
    ref
  ) => {
    const id = `fi:${name}:${counter++}`;
    const [focused, setFocused] = useState();
    const [filled, setFilled] = useState(value && value.length > 0);
    props = {
      ...props,
      name,
      id,
      value,
      onBlur: e => {
        setFocused(false);
        setFilled(e.target.value.trim().length > 0);
        onBlur && onBlur(e);
      },
      onFocus: e => {
        setFocused(true);
        onFocus && onFocus(e);
      },
      ref
    };

    // @material/react-floating-label
    // https://fezvrasta.github.io/bootstrap-material-design/docs/4.0/material-design/forms/
    // label => bmd-label-floating
    // help-block => bmd-help, "<small form-text text-muted
    // valid-feedback / invalid-feedback
    if (type === "checkbox" || type === "radio") {
      props = { type, ...props, className: "form-check-input" };
      return (
        <div className="from-group form-check">
          <input {...props} />
          <label htmlFor={id} className="form-check-label">
            {label}
          </label>
          {placeholder && <small className="form-text text-muted">{placeholder}</small>}
          {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
      );
    }
    if (type === "textarea") {
      props = {
        autoComplete: "off",
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        required,
        rows: 4,
        maxLength,
        ...props,
        className: "form-control"
      };
      return (
        <div className={classNames("form-group", "bmd-form-group", { "is-focused": focused }, { "is-filled": filled })}>
          <label
            htmlFor={id}
            className={classNames(
              { invisible: !label },
              { "bmd-label-floating": floating },
              { "bmd-label-static": !floating },
              { required: required }
            )}
          >
            {label}
          </label>
          {typeof children === "function" ? children(() => <textarea {...props} />) : <textarea {...props} />}
          {placeholder && <small className="form-text text-muted">{placeholder}</small>}
          {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
      );
    }
    if (type === "switch") {
      // TODO
    } else if (type === "range") {
      // custom-range
      props = { required, type, ...props, className: "form-control-range" };
    } else {
      props = {
        autoComplete: "off",
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        type,
        required,
        maxLength,
        ...props,
        className: "form-control"
      };
    }
    return (
      <div className={classNames("form-group", "bmd-form-group", { "is-focused": focused }, { "is-filled": filled })}>
        <label
          htmlFor={id}
          className={classNames(
            { invisible: !label },
            { "bmd-label-floating": floating },
            { "bmd-label-static": !floating },
            { required: required }
          )}
        >
          {label}
        </label>
        {typeof children === "function" ? children(() => <input {...props} />) : <input {...props} />}
        {placeholder && <small className="form-text text-muted">{placeholder}</small>}
        {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
      </div>
    );
  }
);
