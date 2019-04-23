import React, { useState, useRef, useEffect } from "react";
import { useFormState } from "react-use-form-state";
import {
  Alert,
  ActionButton as Button,
  Modal,
  FieldInput,
  FieldSelect,
  i18n,
  useFormInput
} from "../../.ui";
import Page from "../layout/page";

// TODO: apply Captcha

export default props => {
  const [formState, input] = useFormState({
    extra: ["hotel"],
    trip: "one-way",
    cabin: "first"
  });
  const [error, setError] = useState();
  //const [password, setPassword] = useFormInput();
  const [remember] = useFormInput(true);
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const loginEl = useRef();

  useEffect(() => {
    console.log("Login.focus()");
    //loginEl.current.inputRef.current.focus();
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
        //setPassword("");
        setInProgress(false);
      });
  };

  const handleErrorSubmit = (e, formData, errorInputs) => {
    //console.error(errorInputs);
    formData.remember = remember.value;
    console.log(formData);
    setError(i18n.Login_Failed);
  };

  const handleFormSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    const form = e.currentTarget;
    console.log(formState.values);
    console.log(form.checkValidity());
  };

  // was-validated

  return (
    <Page>
      <Modal.Dialog>
        <Modal.Header>
          <h1>{i18n.Login}</h1>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert color="danger">{error}</Alert>}
          <form
            className="needs-validation"
            noValidate
            onSubmit={handleFormSubmit}
            ref={scopeEl}
          >
            <FieldInput
              label="Your name"
              placeholder="Hello world"
              floating={true}
              required
              {...input.text("yourname")}
            />

            <div className="row">
              <div className="col">
                <FieldInput
                  label="Email"
                  floating={true}
                  {...input.email("email")}
                />
              </div>
              <div className="col">
                <FieldInput
                  label="Password"
                  floating={true}
                  {...input.password("password")}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <FieldInput
                  label="Departure"
                  {...input.date("departure-date")}
                />
              </div>
              <div className="col">
                <FieldInput
                  label="Flight Time"
                  {...input.time("flight-time")}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col">
                <FieldInput
                  label="Include Hotel"
                  {...input.checkbox("extra", "hotel")}
                />
              </div>
            </div>
            <FieldInput
              label="Include Car"
              {...input.checkbox("extra", "car")}
            />
            <div className="mt-4">
              <FieldInput label="One-way" {...input.radio("trip", "one-way")} />
            </div>
            <FieldInput
              label="Round Trip"
              {...input.radio("trip", "round-trip")}
            />
            <FieldInput label="Travelers" {...input.number("travelers")} />
            <FieldInput label="Price Range" {...input.range("price-range")} />
            <FieldSelect label="Cabin" {...input.select("cabin")}>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </FieldSelect>
            <FieldInput label="Favorite Cplor" {...input.color("color")} />
            <FieldInput label="Phone" {...input.tel("tel")} />
            <FieldInput label="Website" {...input.url("url")} />
            <FieldInput label="Search" {...input.search("search")} />
            <FieldText label="Note" {...input.textarea("note")} />
            <Button className="d-none" inProgress={inProgress} />
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAction}
            inProgress={inProgress}
          >
            {i18n.Login}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>

      {/* <Modal isOpen={true} autoFocus={true} centered={true}>
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
      </Modal> */}
    </Page>
  );
};
