import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton as Button, Modal, Form } from "../../.ui";
import translator from "../../.ui/Translator";
import { FieldInput, useFormState } from "../../.ui/FormView";
import Page from "../layout/blank";

// TODO: apply Captcha

const i18n = translator("FORM_LOGIN");

export default props => {
  const [formState, input] = useFormState({
    remember: true
  });
  const [formError, setFormError] = useState();
  const [fieldErrors, setFieldErrors] = useState({});
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const focusEl = useRef();

  useEffect(() => {
    console.log("Login.focus()");
    // focusEl.current.focus();
  }, []);

  const handleAction = () => scopeEl.current.dispatchEvent(new Event("submit", { bubbles: false }));

  const handleFormSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    //console.clear();
    console.log(formState.values);
    let errors = formState.errors;
    console.log(errors);

    // react-use-form-state does not report error if a field is not visited
    // use HTML5 JS validation
    // TODO: process custom validation
    const form = e.currentTarget;
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

    let keys = Object.keys(errors);
    if (keys.length > 0) {
      // TODO: translate error
      // keys.forEach(field => (errors[field] = i18n.text(errors[field], field)));
      setFieldErrors(errors);
      errorEl && errorEl.focus();
      return;
    }

    //
    // no error
    //
    console.log("Form.doSubmit()");
    setInProgress(true);
    props.onLogin({ ...formState.values, from: props.from }).catch(error => {
      console.error("Login failed! " + error);
      focusEl.current.focus();
      setFormError(error);
      //setPassword("");
      setInProgress(false);
    });
  };

  return (
    <Page>
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={true}>
        <Modal.Header>
          <h1>{i18n.title("Login")}</h1>
        </Modal.Header>

        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form
            noValidate
            validated={Object.keys(fieldErrors).length > 0}
            onSubmit={handleFormSubmit}
            className="needs-validation"
            ref={scopeEl}
          >
            <FieldInput
              label={i18n.label("User name")}
              floating={true}
              required
              {...input.text("user")}
              errorMessage={fieldErrors.user}
              ref={focusEl}
            />
            <FieldInput
              label={i18n.label("Password")}
              floating={true}
              required
              {...input.password("pass")}
              errorMessage={fieldErrors.pass}
            />
            <div className="mt-4">
              <FieldInput label={i18n.label("Remember Me")} {...input.checkbox("remember")} />
            </div>
            <Button className="d-none" inProgress={inProgress} />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" size="lg" onClick={handleAction} inProgress={inProgress}>
            {i18n.action("Login")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Page>
  );
};
