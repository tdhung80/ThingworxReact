import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton as Button, Modal, Form } from "../../.ui";
import { FieldInput, FieldSelect, useFormState } from "../../.ui/FormView";
import translator from "../../.ui/Translator";
import Page from "../layout/home";
import { fakeAPI } from "../../services";

const i18n = translator("FORM_FORM_DEMO");

// TODO: use validator for advange validation rules
// TODO: react-toastify

const ViewModel = [
  { name: "yourname", type: "text", rules: ["required"] },
  { name: "email", type: "email", rules: ["required"] },
  { name: "password", type: "password", rules: ["required"] },
  { name: "departureDate", type: "date", rules: ["required"] },
  { name: "flightTime", type: "time", rules: ["required"] },
  { name: "month", type: "month", rules: ["required"] },
  { name: "week", type: "week", rules: ["required"] },
  {
    name: "extra",
    type: "checkbox",
    options: ["hotel", "car"] // i18n, extra_item1+
  },
  {
    name: "trip",
    type: "radio",
    options: ["one-way", "round-trip"], // i18n, trip_item1+
    defaultValue: "one-way"
  },
  { name: "travelers", type: "number", rules: ["required"] },
  { name: "priceRange", type: "range", rules: ["required"] },
  {
    name: "cabins",
    type: "selectMultiple",
    rules: ["required"],
    options: ["economy", "business", "first"] // i18n, cabins_item1+
  },
  {
    name: "cabin",
    type: "select",
    rules: ["required"],
    options: ["", "economy", "business", "first"]
  }, // i18n, cabin_item1+
  { name: "color", type: "color", rules: ["required"] },
  { name: "tel", type: "tel", rules: ["required"] },
  { name: "url", type: "url", rules: ["required"] },
  { name: "search", type: "search", rules: ["required"] },
  { name: "suggestions", type: "textarea", rules: ["required"] }
];
const DataModel = {
  yourname: "Hung Tran",
  email: "tdhung80@gmail.com",
  password: "should be encoded",
  departureDate: "2019-12-01",
  flightTime: "11:11",
  month: "2019-01",
  week: "2019-W01",
  extra: ["hotel", "car"],
  trip: "one-way",
  travelers: 1,
  priceRange: 100,
  cabins: ["economy", "first"],
  cabin: "business",
  color: "#0082bf",
  tel: "111-1111-111",
  url: "http://demo.minvps.net",
  search: "N/A",
  suggestions: "something goes here"
};

export default props => {
  const [formState, input] = useFormState(DataModel); // take initial model from props.model
  const [formError, setFormError] = useState();
  const [fieldErrors, setFieldErrors] = useState({});
  const [inProgress, setInProgress] = useState(false);
  const scopeEl = useRef();
  const focusEl = useRef();

  useEffect(() => {
    console.log("Form.focus()");
    // focusEl.current.focus();
  }, []);

  const handleAction = () => {
    // scopeEl.current.submit(); // there is a bug, that doesn't call onSubmit
    scopeEl.current.dispatchEvent(new Event("submit", { bubbles: false }));
  };

  const handleFormSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    console.clear();
    console.log(formState.values);
    let errors = formState.errors;
    console.log(errors);

    // react-use-form-state does not report error if a field is not visited
    // use HTML5 JS validation
    // TODO: process custom validation
    const form = e.currentTarget;
    let errorEl;
    if (!form.checkValidity() || Object.keys(errors).length > 0) {
      // form.reportValidity()
      ["input", "select", "textarea"].forEach(tagName => {
        let elements = form.getElementsByTagName(tagName);
        for (let i = 0, n = elements.length; i < n; i++) {
          let el = elements[i],
            name = el.name;
          // don't override custom validation error
          if (!errors[name] && !el.validity.valid) {
            errors[name] = el.validationMessage;
          }
          if (errors[name] && (!errorEl || errorEl.tabIndex > el.tabIndex)) {
            errorEl = el;
            // TODO: focus on the most top/left element, use el.getBoundingClientRect()
          }
        }
      });
    }

    let keys = Object.keys(errors);
    if (keys.length > 0) {
      // TODO: translate error
      // keys.forEach(field => (errors[field] = i18n.text(errors[field], field)));
      setFieldErrors(errors);
      errorEl && errorEl.focus();
      return;
    }

    //
    // no error
    //
    console.log("Form.doSubmit()");
    setInProgress(true);
    fakeAPI("There are some error happening", true)
      .then(() => {})
      .catch(reason => {
        focusEl.current.focus();
        setFormError(reason);
      })
      .finally(() => setInProgress(false));
  };

  return (
    <Page>
      <Modal.Dialog>
        <Modal.Header>
          <h1>{i18n.text("Demo Form")}</h1>
        </Modal.Header>

        <Modal.Body>
          {formError && (
            <Alert color="danger" className="alert alert-danger">
              {formError}
            </Alert>
          )}
          <Form
            noValidate
            validated={Object.keys(fieldErrors).length > 0}
            onSubmit={handleFormSubmit}
            className="needs-validation"
            ref={scopeEl}
          >
            <FieldInput
              label="Your name"
              placeholder="Hello world"
              floating={true}
              required
              {...input.text("yourname")}
              errorMessage={fieldErrors.yourname}
              ref={focusEl}
            />

            <div className="row">
              <div className="col">
                <FieldInput
                  label="Email"
                  floating={true}
                  required
                  {...input.email("email")}
                  errorMessage={fieldErrors.email}
                />
              </div>
              <div className="col">
                <FieldInput
                  label="Password"
                  floating={true}
                  required
                  minLength="8"
                  {...input.password("password")}
                  errorMessage={fieldErrors.password}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <FieldInput
                  label="Departure"
                  required
                  {...input.date("departureDate")}
                  errorMessage={fieldErrors.departureDate}
                />
              </div>
              <div className="col">
                <FieldInput
                  label="Flight Time"
                  require
                  {...input.time("flightTime")}
                  errorMessage={fieldErrors.flightTime}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <FieldInput label="Month" required {...input.month("month")} errorMessage={fieldErrors.month} />
              </div>
              <div className="col">
                <FieldInput label="Week" required {...input.week("week")} errorMessage={fieldErrors.week} />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <FieldInput label="Include Hotel" {...input.checkbox("extra", "hotel")} />
                <FieldInput label="Include Car" {...input.checkbox("extra", "car")} />
              </div>
              <div className="col">
                <FieldInput label="One-way" {...input.radio("trip", "one-way")} />
                <FieldInput label="Round Trip" {...input.radio("trip", "round-trip")} />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <FieldInput
                  label="Travelers"
                  required
                  {...input.number("travelers")}
                  errorMessage={fieldErrors.travelers}
                />
                <FieldInput
                  label="Price Range"
                  required
                  {...input.range("priceRange")}
                  errorMessage={fieldErrors.priceRange}
                />
              </div>
              <div className="col">
                <FieldSelect
                  label="Cabins"
                  required
                  {...input.selectMultiple("cabins")}
                  size="4"
                  errorMessage={fieldErrors.cabins}
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </FieldSelect>
              </div>
            </div>
            <FieldSelect label="Cabin" required {...input.select("cabin")} errorMessage={fieldErrors.cabin}>
              <option value="">---</option>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </FieldSelect>

            <FieldInput label="Favorite Color" {...input.color("color")} errorMessage={fieldErrors.color} />
            <FieldInput label="Phone" required {...input.tel("tel")} errorMessage={fieldErrors.tel} />
            <FieldInput label="Website" required {...input.url("url")} errorMessage={fieldErrors.url} />
            <FieldInput label="Search" required {...input.search("search")} errorMessage={fieldErrors.search} />
            <FieldInput
              label="Suggestions"
              required
              length="120"
              {...input.textarea("suggestions")}
              errorMessage={fieldErrors.suggestions}
              type="textarea"
            />
            <Button className="d-none" inProgress={inProgress} />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" size="lg" onClick={handleAction} inProgress={inProgress}>
            {i18n.action("Process")}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Page>
  );
};
