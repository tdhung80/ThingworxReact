import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormState } from "react-use-form-state";

// export * from "validator";
export * from "./Fields.FieldInput";
export * from "./Fields.FieldSelect";

export const ValidationForm = React.forwardRef(({ model, children, onSubmit, onValidate, ...props }, ref) => {
  const [formState, input] = useFormState({ ...model }); // take initial model from props.model
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFormSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    // react-use-form-state does not report error if a field is not visited
    // TODO: process custom validation

    const form = e.currentTarget;
    const errors = formState.errors;
    let errorEl;
    if (!form.checkValidity() || Object.keys(errors).length > 0) {
      // form.reportValidity()
      ["input", "select", "textarea"].forEach(tagName => {
        let elements = form.getElementsByTagName(tagName);
        for (let i = 0, n = elements.length; i < n; i++) {
          let el = elements[i];
          let name = el.name;
          // don't override custom validation error
          if (!errors[name] && !el.validity.valid) {
            errors[name] = el.validationMessage;
          }
          if (errors[name] && (!errorEl || errorEl.tabIndex > el.tabIndex)) {
            // console.log(`${name} ${el.tabIndex}`);
            errorEl = el;
            // TODO: focus on the most top/left element, use el.getBoundingClientRect()
          }
        }
      });
    }

    // model validation and also Give a chance to translate errors
    typeof onValidate === "function" && onValidate(formState.values, errors);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      errorEl && errorEl.focus && errorEl.focus();
      return;
    }

    //
    // no error
    //
    typeof onSubmit === "function" && onSubmit(formState.values);
  };

  return (
    <Form
      className="needs-validation"
      {...props}
      noValidate
      validated={Object.keys(fieldErrors).length > 0}
      onSubmit={handleFormSubmit}
      ref={ref}
    >
      {typeof children === "function" ? children(input, fieldErrors) : children}
    </Form>
  );
});
