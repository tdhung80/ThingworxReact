import React, { useState } from "react";
import { Modal, Input } from "../../.ui";
import translator from "../../.ui/Translator";

const i18n = translator("FORM_DEBOUNCE_DEMO");

export default () => {
  const [bounceText, setBounceText] = useState();

  const handleChange = e => {
    setBounceText(e.target.value);
  };

  return (
    <div>adasdas das</div>

    // <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
    //   <Modal.Header>
    //     <h1>{i18n.text("Demo Debounce")}</h1>
    //   </Modal.Header>

    //   <Modal.Body>
    //     <Input type="text" onChange={handleChange} />
    //     <div>{bounceText}</div>
    //   </Modal.Body>

    //   <Modal.Footer />
    // </Modal>
  );
};
