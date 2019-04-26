import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton, Button, Modal, ProgressBar } from "../../.ui";
import translator from "../../.ui/Translator";
import { fakeAPI } from "../../services";

const i18n = translator("FORM_{COMPONENT NAME}_DEMO");

export default () => {
  const handleAction = () => {
    console.log("Action clicked");
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Demo Grid")}</h1>
      </Modal.Header>

      <Modal.Body>
        <div>New component goes here</div>
      </Modal.Body>

      <Modal.Footer>
        <ActionButton
          variant="primary"
          size="lg"
          onClick={handleAction}
          //inProgress={inProgress}
        >
          {i18n.action("Process")}
        </ActionButton>
      </Modal.Footer>
    </Modal>
  );
};
