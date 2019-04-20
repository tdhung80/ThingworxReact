import React, { useState } from "react";
import { FormGroup as FG } from "reactstrap";

export function FormGroup(props) {
  const copy = { ...props, className: "bmd-form-group" };
  return <FG {...copy} />;
}

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setValue(value);
  }

  return [{ value, onChange: handleChange }, setValue];
}

// TODO: use FormState
