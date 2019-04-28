import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton as Button, Modal } from "../../.ui";
import { ValidateForm as Form, FieldInput, FieldSelect } from "../../.ui/Forms";
import translator from "../../.ui/Translator";
import { fakeAPI, service } from "../../services";

const i18n = translator("FORM_SERVICE_DEMO");

const Model = { serviceUrl: "Resources/CurrentSessionInfo/Services/GetCurrentUserGroups" };

export default () => {
  const [formError, setFormError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const focusEl = useRef();

  const handleFormSubmit = model => {
    //
    // no error
    //
    setInProgress(true);
    //fakeAPI("There are some error happening", true)
    service(model.serviceUrl + "?")
      .then(() => {
        console.log("success");
      })
      .catch(reason => {
        console.error("failed");
        focusEl.current.focus();
        setFormError(reason);
      })
      .finally(() => setInProgress(false));
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Service Playground")}</h1>
      </Modal.Header>

      <Modal.Body>
        {formError && (
          <Alert color="danger" className="alert alert-danger">
            {formError}
          </Alert>
        )}
        <Form onSubmit={handleFormSubmit} model={Model} ref={scopeEl}>
          {(input, fieldErrors) => (
            <>
              <FieldInput
                label="Service Url"
                placeholder=""
                floating={true}
                required={true}
                {...input.text("serviceUrl")}
                errorMessage={fieldErrors.serviceUrl}
                ref={focusEl}
              />
              <Button variant="primary" type="submit" inProgress={inProgress}>
                {i18n.action("Process")}
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};
