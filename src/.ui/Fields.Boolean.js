import React from "react";
import { Label, Input } from "./";

let counter = 0;

export const BooleanField = React.forwardRef(
  ({ name, label, onChange, ...props }, ref) => {
    const id = `bf:${name}:${counter++}`;
    const handleClick = e => onChange && onChange(e); // MD stopped React onChange working
    props = {
      ...props,
      id,
      className: "form-check-input",
      ref,
      onClick: handleClick
    };

    return (
      <div className="form-check">
        <Input {...props} defaultChecked />
        <Label for={id} className="form-check-label">
          {label}
        </Label>
      </div>
    );
  }
);
