import React from "react";
import {
  Alert,
  Button,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextField,
  ValidationForm
} from "../../.ui";
// TODO import ReCAPTCHA from "react-google-recaptcha";

export default class LoginView extends React.Component {
  constructor() {
    super();

    this.state = { error: "" };
    this.scopeEl = React.createRef();

    console.log("LoginView");
  }

  handleAction = () => {
    var submitEvent = new Event("submit", { bubbles: false });
    this.scopeEl.current.handleSubmit(submitEvent);
  };

  handleSubmit = (e, formData, inputs) => {
    e.preventDefault();

    this.captchaEl.current.execute();
    // const recaptchaValue = this.captchaEl.current.getValue();

    console.log(JSON.stringify(formData, null, 2));
  };

  handleErrorSubmit = (e, formData, errorInputs) => {
    console.error(errorInputs);
    this.setState({
      ...this.state,
      error: "Your username or password is incorrect"
    });
  };

  render() {
    return (
      <Modal isOpen={true} autoFocus={false} centered={true}>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
          <ValidationForm
            onSubmit={this.handleSubmit}
            onErrorSubmit={this.handleErrorSubmit}
            ref={this.scopeEl}
          >
            <FormGroup className="bmd-form-group">
              <TextField name="user" label="Username" required={true} />
            </FormGroup>
            <FormGroup>
              <TextField
                name="pass"
                label="Password"
                type="password"
                required={true}
              />
            </FormGroup>
          </ValidationForm>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleAction}>
            Login
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
