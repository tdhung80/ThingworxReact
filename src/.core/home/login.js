import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  BooleanField,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  StringField,
  ValidationForm,
  i18n,
  useFormInput
} from "../../.ui";
import Page from "../layout/page";

// TODO: apply Captcha

export default props => {
  const [error, setError] = useState();
  const [password, setPassword] = useFormInput();
  const [remember] = useFormInput(true);
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const loginEl = useRef();

  useEffect(() => {
    console.log("Login.focus()");
    loginEl.current.inputRef.current.focus();
  }, []);

  const handleAction = () => {
    var submitEvent = new Event("submit", { bubbles: false });
    scopeEl.current.handleSubmit(submitEvent);
  };

  const handleSubmit = (e, formData, inputs) => {
    e.preventDefault();
    if (inProgress) return;
    setError("");
    setInProgress(true);
    debugger;
    props
      .onLogin({ ...formData, from: props.from, remember: remember.value })
      .catch(error => {
        console.error("Login failed! " + error);
        setError(error);
        setPassword("");
        setInProgress(false);
      });
  };

  const handleErrorSubmit = (e, formData, errorInputs) => {
    //console.error(errorInputs);
    formData.remember = remember.value;
    console.log(formData);
    setError(i18n.Login_Failed);
  };

  return (
    <Page>
      <Modal isOpen={true} autoFocus={true} centered={true}>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          <ValidationForm
            onSubmit={handleSubmit}
            onErrorSubmit={handleErrorSubmit}
            ref={scopeEl}
          >
            <FormGroup>
              <StringField
                name="user"
                label="Username"
                required={true}
                ref={loginEl}
              />
            </FormGroup>
            <FormGroup>
              <StringField
                name="pass"
                label="Password"
                type="password"
                required={true}
                {...password}
              />
            </FormGroup>
            <FormGroup>
              <BooleanField
                name="remember"
                label="Remember me"
                type="checkbox"
                checked={remember.value}
                {...remember}
              />
            </FormGroup>
            <Button className="d-none" inProgress={inProgress} />
          </ValidationForm>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            size="lg"
            onClick={handleAction}
            inProgress={inProgress}
          >
            {i18n.Login}
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};
