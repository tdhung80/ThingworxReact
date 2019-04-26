import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton, Button, Modal, ProgressBar } from "../../.ui";
import translator from "../../.ui/Translator";
import { fakeAPI } from "../../services";

const i18n = translator("FORM_SERVICE_DEMO");

export default () => {
  const handleAction = () => {
    console.log("Action clicked");
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Service Playground")}</h1>
      </Modal.Header>

      <Modal.Body>
        <div>New component goes here</div>
        <ActionButton
          variant="primary"
          size="lg"
          onClick={handleAction}
          //inProgress={inProgress}
        >
          {i18n.action("Process")}
        </ActionButton>
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};
