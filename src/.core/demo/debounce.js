import React, { useState } from "react";
import { Modal, Form, Button, useDebounce } from "../../.ui";
import translator from "../../.ui/Translator";

const i18n = translator("FORM_DEBOUNCE_DEMO");

export default () => {
  const [searchTerm, setSearchTerm] = useState();
  const debounceSetSearchTerm = useDebounce(setSearchTerm, 1000);

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Demo Debounce")}</h1>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <input type="text" className="form-control" onChange={e => debounceSetSearchTerm(e.target.value)} />
          <div className="mt-5">{searchTerm}</div>
          <Button onClick={e => console.log(GLOBAL_VARIABLE)}>SET GLOBAL_VARIABLE in Console and Click Me!</Button>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};
