/*
import React, { useState } from "react";
import AsyncSelect from "react-select/lib/Async";
import classNames from "classnames";

let counter = 0;

export const FieldEntity = React.forwardRef(
  ({ name, label, required = false, placeholder, errorMessage, onBlur, onFocus, ...props }, ref) => {
    const id = `fs:${name}:${counter++}`;
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

    const EntityCollections = server.EntityCollections.map(c => {
      return { value: c, label: c };
    });

    const promiseOptions = async inputValue =>
      await EntityCollections.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

    const handleInputChange = newValue => {
      const inputValue = newValue.replace(/\W/g, "");
      console.log(newValue + " >>> " + inputValue);
      return inputValue;
    };

    return (
      <div className={classNames("form-group", "bmd-form-group", { "is-focused": focused }, { "is-filled": filled })}>
        <label htmlFor={id} className={classNames("bmd-label-static", { invisible: !label, required: required })}>
          {label}
        </label>
        <AsyncSelect
          cacheOptions
          defaultOptions={EntityCollections}
          loadOptions={promiseOptions}
          onInputChange={handleInputChange}
          isClearable={true}
        />
        {placeholder && <small className="form-text text-muted">{placeholder}</small>}
        {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
      </div>
    );
  }
);
*/
