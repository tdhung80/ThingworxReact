import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Alert, ActionButton as Button, Modal } from "../../.ui";
import translator from "../../.ui/Translator";
import { ValidationForm as Form, FieldInput } from "../../.ui/Forms";
import * as service from "../../services/user.service";

// TODO: apply Captcha

const i18n = translator("FORM_LOGIN");

export default withRouter(({ history }) => {
  const [formError, setFormError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const focusEl = useRef();

  useEffect(() => {
    console.log("Login.focus()");
    // focusEl.current.focus();
  }, []);

  const handleAction = () => scopeEl.current.dispatchEvent(new Event("submit", { bubbles: false }));

  const handleFormSubmit = model => {
    if (inProgress) return;
    console.log("Form.doSubmit()");

    setInProgress(true);
    service
      .login(model.user, model.pass)
      .then(() => {
        console.log("Login success");
        const state = history.location.state;
        state ? history.push(state.from || "/") : history.push("/");
      })
      .catch(error => {
        console.error("Login failed! " + error);
        focusEl.current.focus();
        setFormError(error);
        //setPassword("");
        setInProgress(false);
      });
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" centered show={true}>
      <Modal.Header>
        <h1>{i18n.title("Login")}</h1>
      </Modal.Header>

      <Modal.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
        <Form onSubmit={handleFormSubmit} model={{ remember: true }} ref={scopeEl}>
          {(input, fieldErrors) => (
            <>
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
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" size="lg" onClick={handleAction} inProgress={inProgress}>
          {i18n.action("Login")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
