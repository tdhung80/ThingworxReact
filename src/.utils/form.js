export function validateForm(form, errors) {
  let errorEl;
  if (!form.checkValidity() || Object.keys(errors).length > 0) {
    // form.reportValidity()
    ["input", "select", "textarea"].forEach(tagName => {
      let elements = form.getElementsByTagName(tagName);
      for (let i = 0, n = elements.length; i < n; i++) {
        let el = elements[i],
          name = el.name;
        // don't override custom validation error
        if (!errors[name] && !el.validity.valid) {
          errors[name] = el.validationMessage;
        }
        if (errors[name] && (!errorEl || errorEl.tabIndex > el.tabIndex)) {
          errorEl = el;
          // TODO: focus on the most top/left element, use el.getBoundingClientRect()
        }
      }
    });
  }
  return errorEl;
}
