import React, { useState, useRef } from "react";
import { InputGroup, Button } from "react-bootstrap";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import ReactTable from "../../.ui/Table";
import "react-table/react-table.css";
// import JSONTree from "react-json-tree";
import JSONViewer from "react-json-viewer";
import JSONInput from "react-json-editor-ajrm/index";
import locale from "react-json-editor-ajrm/locale/en";
import { Alert, ActionButton, Modal, Stepper, useDebounce } from "../../.ui";
import { ValidationForm as Form, FieldInput } from "../../.ui/Forms";

import _ from "lodash";
import translator from "../../.ui/Translator";
import * as server from "../../services/backend";
import * as service from "../../services/user.service";

const i18n = translator("FORM_SERVICE_PLAYGROUND");

const Model = {
  serviceUrl: "Resources/CurrentSessionInfo/Services/GetServiceDefinitions",
  data: {}
};

export default () => {
  const [formError, setFormError] = useState();
  const [serviceArgs, setServiceArgs] = useState(Model.data);
  const [inProgress, setInProgress] = useState(false);
  const [grid, setGrid] = useState({
    columns: [
      {
        Header: "No Data",
        accessor: "NO_DATA"
      }
    ],
    data: []
  });
  const focusEl = useRef();
  const scopeEl = useRef(); // form
  const stepperEl = useRef();

  const getServiceDefinition = () => {
    const { serviceUrl } = scopeEl.current.getModel();
    const serviceName = serviceUrl.substr(serviceUrl.lastIndexOf("/") + 1);
    if (!serviceName) {
      setFormError("Not a valid service URL. {Collection}/{Entity}/Services/{Service}");
    }
    const serviceURI = serviceUrl.replace(/\/[^/]*$/, "/GetServiceDefinition");
    server
      .send(serviceURI, { name: serviceName })
      .then(res => {
        console.debug(res);
        // rows[0].parameterDefinitions.rows => name / baseType
        const serviceArgs = {};
        res.rows[0].parameterDefinitions.rows.forEach(p => {
          switch (p.baseType) {
            case "STRING":
              serviceArgs[p.name] = p.description;
              break;
            default:
              serviceArgs[p.name] = p.baseType;
              break;
          }
        });
        setServiceArgs(serviceArgs);
      })
      .catch(reason => {
        console.error(reason);
        focusEl.current.focus();
        setFormError(reason);
      });
  };

  const handleFormSubmit = model => {
    console.log(model);
    //
    // no error
    //
    setInProgress(true);
    //fakeAPI("There are some error happening", true)
    server
      .send(model.serviceUrl, serviceArgs)
      .then(res => {
        console.debug(res);
        // data:{ "dataShape": { "fieldDefinitions": { "fieldName": { name, description, baseType: STRING, ordinal: int } } }, rows: [ { row info } ] }
        const fields = res.dataShape.fieldDefinitions;
        if (model.serviceUrl.endsWith("/ServiceDefinitions") || model.serviceUrl.endsWith("/GetServiceDefinitions")) {
          // exclude built-in services
          res.rows = _.filter(res.rows, row => server.GenericServices.indexOf(row.name) === -1);
        }
        setGrid({
          data: res.rows,
          columns: _.orderBy(
            Object.keys(fields).map(name => {
              return { ...fields[name], id: name };
            }),
            ["ordinal"],
            ["asc"]
          ).map(field => {
            if (field.baseType === "INFOTABLE") {
              return {
                Header: field.name,
                accessor: field.id,
                Cell: () => <span>JSON</span>
              };
            }
            return { Header: field.name, accessor: field.id };
          })
        });
        stepperEl.current.next();
      })
      .catch(reason => {
        console.error(reason);
        // focusEl.current.focus();
        setFormError(reason);
      })
      .finally(() => setInProgress(false));
  };

  const stepContentStyle = { position: "relative", height: "554px" };

  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef();
  let source = [...server.EntityCollections];
  const loadSuggestions = value => {
    let suggestions = [];
    if (value === "") {
      suggestions = server.EntityCollections;
    } else {
      const regex = new RegExp("^" + value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      suggestions = source.filter(s => regex.test(s));
    }
    setSuggestions(suggestions);
    return suggestions;
  };

  const debounceLoadSuggestions = useDebounce((value, reason) => {
    console.log("LoadSuggestions: " + value + " " + reason);
    value = value.trim();
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    const input = searchRef.current.input;
    switch (reason) {
      case "escape-pressed":
        nativeInputValueSetter.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        break;
      case "input-changed":
      case "suggestion-selected":
        let suggestions = loadSuggestions(value);
        if (suggestions.length === 0) {
          const tokens = value.split("/");
          const entityCollection = tokens[0];
          if (server.EntityCollections.indexOf(entityCollection) !== -1) {
            const search = tokens.length > 1 ? tokens[1] : "";
            server
              .send("Resources/EntityServices/Services/GetEntityList", {
                maxItems: 1000,
                nameMask: search + "*",
                type: entityCollection.substr(0, entityCollection.length - 1) // convert collectionName to entityName
              })
              .then(res => {
                suggestions = res.rows.map(r => value + "/" + r.name);
                setSuggestions(suggestions);
                source = [...source, ...suggestions];
              });
          }
        }
        break;
      default:
        loadSuggestions(value);
        break;
    }
  }, 500);
  const onSuggestionsFetchRequested = ({ value, reason }) => {
    console.debug("onSuggestionsFetchRequested: " + value + " " + reason);
    switch (reason) {
      case "escape-pressed":
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        const input = searchRef.current.input;
        nativeInputValueSetter.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        break;
      case "input-changed":
      case "suggestion-selected":
        let suggestions = loadSuggestions(value);
        if (suggestions.length === 0) {
          debounceLoadSuggestions(value, reason);
        }
        break;
      default:
        loadSuggestions(value);
        break;
    }
  };
  const onSuggestionSelected = (e, { suggestion, suggestionValue }) => {
    e.stopPropagation();
    e.preventDefault();
    console.debug("onSuggestionSelected: " + suggestionValue);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    const input = searchRef.current.input;
    nativeInputValueSetter.call(input, suggestionValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const renderSuggestion = (suggestion, { query }) => {
    const matches = match(suggestion, query);
    const parts = parse(suggestion, matches);
    return (
      <span>
        {parts.map((part, index) => {
          const className = part.highlight ? "react-autosuggest__suggestion-match" : null;
          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true}>
      <Modal.Header>
        <h1>{i18n.text("Service Playground")}</h1>
        <span>{service.getUser().username}</span>
      </Modal.Header>

      <Modal.Body>
        {formError && (
          <Alert color="danger" className="alert alert-danger">
            {formError}
          </Alert>
        )}

        <Stepper
          animation={false}
          linear={false}
          ref={stepperEl}
          steps={[
            {
              header: { circle: <span class="fa fa-cogs" />, label: "Action" },
              style: stepContentStyle,
              content: (
                <>
                  <Form onSubmit={handleFormSubmit} model={Model} ref={scopeEl}>
                    {(input, fieldErrors) => (
                      <>
                        <div className="form-group bmd-form-group">
                          <label className="bmd-label-static">Service Url</label>
                          <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setSuggestions([])}
                            onSuggestionSelected={onSuggestionSelected}
                            getSuggestionValue={s => s}
                            renderSuggestion={renderSuggestion}
                            alwaysRenderSuggestions={true}
                            highlightFirstSuggestion={true}
                            inputProps={{ ...input.text("serviceUrl1"), className: "form-control" }}
                            ref={searchRef}
                          />
                        </div>
                        <FieldInput
                          label="Service Url"
                          placeholder="{Collection}/{Entity}/Services/{Service}"
                          floating={true}
                          required={true}
                          {...input.text("serviceUrl")}
                          errorMessage={fieldErrors.serviceUrl}
                          ref={focusEl}
                        >
                          {makeInput => (
                            <InputGroup className="mb-3">
                              {makeInput()}
                              <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={getServiceDefinition}>
                                  Fetch
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                          )}
                        </FieldInput>
                        <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                          <JSONInput
                            placeholder={serviceArgs}
                            theme="light_mitsuketa_tribute"
                            locale={locale}
                            theme="dark_vscode_tribute"
                            height="387.256px"
                            width="100%"
                            onChange={({ jsObject }) => jsObject && setServiceArgs(jsObject)}
                          />
                        </div>
                        <ActionButton variant="primary" className="pa b0 r0" type="submit" inProgress={inProgress}>
                          {i18n.action("Process")}
                        </ActionButton>
                      </>
                    )}
                  </Form>
                </>
              )
            },
            {
              header: { circle: <span class="fa fa-list" />, label: "Result" },
              style: stepContentStyle,
              content: (
                <>
                  <ReactTable
                    data={grid.data}
                    columns={grid.columns}
                    defaultPageSize={10}
                    minRows={10}
                    className="-striped -highlight"
                    filterable
                    defaultFilterMethod={(filter, row) => {
                      let cellValue = String(row[filter.id]);
                      return cellValue.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
                    }}
                    SubComponent={row => {
                      let data = row.original;
                      let json = {};
                      Object.keys(data).forEach(p => data[p] instanceof Object && (json[p] = data[p].rows));
                      if (Object.keys(json).length === 0) {
                        return <></>;
                      }
                      return (
                        <div style={{ padding: "20px" }}>
                          <JSONViewer json={json} />
                        </div>
                      );
                    }}
                    previousText={i18n.action("Previous")}
                    nextText={i18n.action("Next")}
                    loadingText={i18n.text("Loading...")}
                    noDataText={i18n.text("No rows found")}
                    pageText={i18n.label("Page")}
                    ofText={i18n.label("of")}
                    rowsText={i18n.label("rows")}
                  />
                  <ActionButton variant="primary" className="pa b0 r0" onClick={() => stepperEl.current.previous()}>
                    {i18n.action("Back")}
                  </ActionButton>
                </>
              )
            }
          ]}
        />
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};
