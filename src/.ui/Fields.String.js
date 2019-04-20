import React from "react";
import { Label, Input, TextInput } from "./";

let counter = 0;

export const StringField = React.forwardRef(
  ({ name, label, placeholder, required, errorMessage, ...props }, ref) => {
    const id = `sf:${name}:${counter++}`;
    props = { ...props, name, id, ref };
    return (
      <React.Fragment>
        <Label for={id} className={label ? "bmd-label-floating" : "invisible"}>
          {label}
        </Label>
        {(() => {
          if (required) {
            return (
              <React.Fragment>
                <TextInput
                  {...props}
                  required
                  successMessage="Looks good!"
                  errorMessage={
                    errorMessage
                      ? errorMessage
                      : label
                      ? "Please provide " + label
                      : "Please provide a value"
                  }
                />
                {placeholder && <span className="bmd-help">{placeholder}</span>}
              </React.Fragment>
            );
          }
          return (
            <React.Fragment>
              <Input {...props} />;
              {placeholder && <span className="bmd-help">{placeholder}</span>}
            </React.Fragment>
          );
        })()}
      </React.Fragment>
    );
  }
);
