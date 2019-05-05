import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton, Button, Modal, ProgressBar, Stepper } from "../../.ui";
import translator from "../../.ui/Translator";
import { fakeAPI } from "../../services/backend-fake";

const i18n = translator("FORM_{COMPONENT NAME}_DEMO");

export default () => {
  const scopeEl = useRef();

  const handleAction = () => {
    console.log("Action clicked");
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Demo Grid")}</h1>
      </Modal.Header>

      <Modal.Body>
        <Stepper
          animation={false}
          linear={true}
          ref={scopeEl}
          steps={[
            {
              header: { circle: <span class="fa fa-user" />, label: "Email" },
              content: (
                <>
                  <div> Email tab </div>
                  <Button onClick={() => scopeEl.current.next()}>Next</Button>
                </>
              )
            },
            {
              header: { label: "Password" },
              content: (
                <>
                  <div> Password tab </div>
                  <Button onClick={() => scopeEl.current.previous()}>Prev</Button>
                </>
              )
            }
          ]}
        />
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
