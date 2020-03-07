import React, { useState, useRef } from "react";
import * as crypto from "../../.utils/crypto";
import TWServerURI from "../../services/backend.settings";
import { Container, ActionButton as Button, Modal } from "../../.ui";
import { ValidationForm as Form, FieldInput } from "../../.ui/Forms";

const model = { source: `KEY = "Hello World !"` };

export default () => {
  const [output, setOutput] = useState(crypto.encrypt(model.source));
  const scopeEl = useRef();

  const encrypt = () => {
    const model = scopeEl.current.getModel();
    setOutput(crypto.encrypt(model.source));
  };

  const descrypt = () => {
    const descrypted = crypto.descrypt(output);
    setOutput(descrypted);
  };

  const test = () => {
    /*
    fetch("//www.minvps.net/settings.ini", {
      method: "GET",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain"
      },
      mode: "no-cors",
      cache: "no-cache"
    }).then(res => {
      //debugger;
      console.log(res.text());
    });*/
    console.log(TWServerURI);
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true} onHide={() => false}>
      <Modal.Header>
        <h1>Demo Crypto</h1>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Form ref={scopeEl} model={model}>
            {(input, fieldErrors) => (
              <>
                <FieldInput
                  label="Source"
                  required
                  maxLength={1000}
                  {...input.textarea("source")}
                  errorMessage={fieldErrors.source}
                  type="textarea"
                />
              </>
            )}
          </Form>
          <FieldInput
            label="Output"
            maxLength={64000}
            type="textarea"
            value={output}
            onChange={e => setOutput(e.target.value)}
          />
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" size="lg" onClick={encrypt}>
          Encrypt
        </Button>
        <Button variant="secondary" size="lg" onClick={descrypt}>
          Descrypt
        </Button>
        <Button variant="secondary" size="lg" onClick={test}>
          Test
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
