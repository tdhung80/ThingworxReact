import React, { useState, useRef } from "react";
import { InputGroup, Button } from "react-bootstrap";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import ReactTable from "../../.ui/Table";
import "react-table/react-table.css";
import JSONTree from "react-json-tree";
import * as themes from "base16"; // https://codesandbox.io/s/w6lkxqxqll
import JSONViewer from "react-json-viewer";
import JSONInput from "react-json-editor-ajrm/index";
import locale from "react-json-editor-ajrm/locale/en";
import { Alert, ActionButton, Modal, Stepper, useDebounce } from "../../.ui";
import { ValidationForm as Form, FieldInput, useFormInput } from "../../.ui/Forms";

import _ from "lodash";
import translator from "../../.ui/Translator";
import * as server from "../../services/backend";
import * as service from "../../services/user.service";

const i18n = translator("FORM_SERVICE_PLAYGROUND");

const Model = {
  serviceUrl: "",
  data: {}
};

export default () => {
  const [formError, setFormError] = useState();
  const [serviceArgs, setServiceArgs] = useState(Model.data);
  const [inProgress, setInProgress] = useState(false);
  const [formState, setFormState] = useState({ JSONResult: null });
  const [grid, setGrid] = useState({
    columns: [
      {
        Header: "No Data",
        accessor: "NO_DATA"
      }
    ],
    data: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const [source, setSource] = useState(server.EntityCollections);
  const [searchInput, setSearchInput] = useFormInput("");

  const searchRef = useRef();
  const scopeEl = useRef(); // form
  const stepperEl = useRef();
  const stepContentStyle = { position: "relative", height: "56rem", paddingBottom: "4.8rem" };

  // const setSearchInput = (value = "") => {
  //   const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  //   const input = searchRef.current;
  //   nativeInputValueSetter.call(input, value);
  //   input.dispatchEvent(new Event("input", { bubbles: true }));
  // };

  const getServiceDefinition = value => {
    // const { serviceUrl } = scopeEl.current.getModel();
    const serviceUrl = value || searchInput.value;
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
        searchRef.current.input.focus();
        setFormError(reason);
      });
  };

  const handleFormSubmit = model => {
    model.serviceUrl = searchInput.value;
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
        if (res.dataShape && res.rows) {
          // INFOTABLE:{ "dataShape": { "fieldDefinitions": { "fieldName": { name, description, baseType: STRING, ordinal: int } } }, rows: [ { row info } ] }
          const fields = res.dataShape.fieldDefinitions;
          if (model.serviceUrl.endsWith("/ServiceDefinitions") || model.serviceUrl.endsWith("/GetServiceDefinitions")) {
            // exclude built-in services
            res.rows = _.filter(res.rows, row => server.EntityGenericServices.indexOf(row.name) === -1);
          }
          setGrid({
            data: res.rows,
            columns: _.orderBy(
              Object.keys(fields).map(name => ({ ...fields[name], id: name })),
              ["ordinal"],
              ["asc"]
            ).map(field => {
              if (field.baseType === "INFOTABLE") {
                return {
                  Header: field.name,
                  width: field.name.length * 18,
                  accessor: field.id,
                  Cell: () => <span>JSON</span>
                };
              }
              return { Header: field.name, accessor: field.id };
            })
          });
          setFormState({ ...formState, JSONResult: null });
        } else {
          setFormState({ ...formState, JSONResult: res });
        }
        stepperEl.current.next();
      })
      .catch(reason => {
        console.error(reason);
        // focusEl.current.focus();
        setFormError(reason);
      })
      .finally(() => setInProgress(false));
  };

  const loadSuggestions = (value, otherSource) => {
    let suggestions = [];
    if (value === "") {
      suggestions = server.EntityCollections;
    } else {
      const regex = new RegExp("^" + value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      suggestions = (otherSource || source).filter(s => regex.test(s));
    }
    setSuggestions(suggestions);
    return suggestions;
  };

  const debounceLoadSuggestions = useDebounce((value, reason) => {
    console.log("debounceLoadSuggestions: " + value + " " + reason);

    const tokens = value.split("/");
    const entityCollection = tokens[0];
    if (server.EntityCollections.indexOf(entityCollection) !== -1) {
      setSuggestions(["Loading..." + value]);
      switch (tokens.length) {
        case 2: {
          // entityCollection/*
          const search = tokens[1];
          // TODO: don't search the same term in 5 minutes when no result
          server
            .send("Resources/EntityServices/Services/GetEntityList", {
              maxItems: 200,
              nameMask: search + "*",
              type: entityCollection.substr(0, entityCollection.length - 1) // convert collectionName to entityName
            })
            .then(res => {
              const suggestions = res.rows.map(r => entityCollection + "/" + r.name).sort();
              setSource([...source, ...suggestions]);
              loadSuggestions(searchInput.value, suggestions);
            })
            .catch(reason => {
              console.error(reason);
              setFormError(reason);
            });
          break;
        }
        case 4: {
          // entityCollection/entity/Services/*
          const entity = tokens[1];
          const handler = tokens[2];
          if (handler === "Services") {
            server
              .send(`${entityCollection}/${entity}/ServiceDefinitions`)
              .then(res => {
                const suggestions = _.filter(res.rows, r => server.EntityGenericServices.indexOf(r.name) === -1)
                  .map(r => `${entityCollection}/${entity}/Services/${r.name}`)
                  .sort();
                setSource([...source, ...suggestions]);
                loadSuggestions(searchInput.value, suggestions);
              })
              .catch(reason => {
                console.error(reason);
                setFormError(reason);
              });
          } else {
            // no suggestion
            setSuggestions([]);
          }
          break;
        }
        default:
          break;
      }
    }
  }, 500);
  const onSuggestionsFetchRequested = ({ value, reason }) => {
    console.debug(`onSuggestionsFetchRequested: '${value}' ${reason} '${searchInput.value}'`);
    if (value.startsWith("Loading...")) return;

    switch (reason) {
      case "escape-pressed":
        // AutoSuggest pass an empty value in this scenario
        value = searchInput.value;
        if (value.endsWith("/")) value = value.substr(0, value.length - 1);
        else value = value.replace(new RegExp(value.substr(value.lastIndexOf("/") + 1) + "$"), "");
        setSearchInput(value);
        if (value === "") {
          loadSuggestions("", server.EntityCollections);
        } else {
          onSuggestionsFetchRequested({ value, reason: "suggestion-selected" });
        }
        break;
      case "input-changed":
      case "suggestion-selected":
        const tokens = value.split("/");
        const entityCollection = tokens[0];
        let n = tokens.length;
        if (reason === "suggestion-selected") {
          if (n === 1 && server.EntityCollections.indexOf(entityCollection) >= 0) {
            value = `${entityCollection}/`;
            n = 2;
          }
        }
        switch (n) {
          case 1:
            // EntityCollection
            loadSuggestions(value, server.EntityCollections);
            break;
          case 3: {
            // EntityCollection/Entity/Handler
            const entity = tokens[1];
            let suggestions = loadSuggestions(
              value,
              server.EntityHandlers.map(s => `${entityCollection}/${entity}/${s}`)
            );
            if (suggestions.length === 1 && reason === "suggestion-selected") {
              // console.log('fetch ' + value)
              onSuggestionsFetchRequested({ value: value + "/", reason });
            }
            break;
          }
          case 2:
          case 4: {
            // EntityCollection/Entity
            // EntityCollection/Entity/Services/Service
            let suggestions = loadSuggestions(value, _.filter(source, s => s.split("/").length === n));
            if (suggestions.length === 0) {
              debounceLoadSuggestions(value, reason);
            } else if (n === 2 && suggestions.length === 1 && reason === "suggestion-selected") {
              onSuggestionsFetchRequested({ value: value + "/", reason });
            } else if (n === 4 && suggestions.length === 1 && reason === "suggestion-selected") {
              setSuggestions([]);
              getServiceDefinition(value);
            }
            break;
          }
          default:
            setSuggestions([]);
            break;
        }
        break;
      default:
        // input-focused
        loadSuggestions(value);
        break;
    }
  };
  const onSuggestionSelected = (e, { suggestion, suggestionValue }) => {
    e.stopPropagation();
    e.preventDefault();
    console.debug("onSuggestionSelected: " + suggestionValue);
    if (!suggestionValue.startsWith("Loading...")) setSearchInput(suggestionValue);
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
    <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={true} onHide={() => false}>
      <Modal.Header>
        <h1>{i18n.text("Service Playground")}</h1>
        {service.isAnonymous() ? (
          <span>{service.getUser().username}</span>
        ) : (
          <a
            href="#a"
            onClick={() => {
              service.logout(true, () => service.loginAsAnonymous());
              return false;
            }}
          >
            {service.getUser().username}
          </a>
        )}
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
              header: { circle: <span className="fa fa-cogs" />, label: i18n.label("Action") },
              style: stepContentStyle,
              content: (
                <>
                  <Form onSubmit={handleFormSubmit} model={Model} ref={scopeEl}>
                    {(input, fieldErrors) => (
                      <>
                        <Autosuggest
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={() => setSuggestions([])}
                          onSuggestionSelected={onSuggestionSelected}
                          getSuggestionValue={s => s}
                          renderSuggestion={renderSuggestion}
                          alwaysRenderSuggestions={true}
                          highlightFirstSuggestion={true}
                          inputProps={searchInput}
                          ref={searchRef}
                          renderInputComponent={inputProps => (
                            <FieldInput
                              label={i18n.field("serviceUrl")}
                              name="serviceUrl"
                              placeholder="{Collection}/{Entity}/Services/{Service}"
                              floating={true}
                              required={true}
                              {...inputProps}
                            />
                          )}
                        />
                        <div style={{ maxWidth: "140rem", maxHeight: "100%", height: "40.5rem" }}>
                          <JSONInput
                            placeholder={serviceArgs}
                            //theme="light_mitsuketa_tribute"
                            locale={locale}
                            theme="dark_vscode_tribute"
                            height="100%"
                            width="100%"
                            onChange={({ jsObject }) => jsObject && setServiceArgs(jsObject)}
                          />
                        </div>
                        <ActionButton variant="primary" className="pa b0 r0" type="submit" inProgress={inProgress}>
                          {i18n.action("Execute")}
                        </ActionButton>
                      </>
                    )}
                  </Form>
                </>
              )
            },
            {
              header: { circle: <span className="fa fa-list" />, label: i18n.label("Result") },
              style: stepContentStyle,
              content: () => {
                const { JSONResult } = formState;
                if (JSONResult) {
                  return (
                    <div className="json-tree-container" style={{ height: "49rem" }}>
                      <JSONTree data={JSONResult} theme={themes.bright} invertTheme={false} />
                      <ActionButton variant="primary" className="pa b0 r0" onClick={() => stepperEl.current.previous()}>
                        {i18n.action("Back")}
                      </ActionButton>
                    </div>
                  );
                }
                return (
                  <>
                    <ReactTable
                      data={grid.data}
                      columns={grid.columns}
                      defaultPageSize={10}
                      minRows={10}
                      className="-striped -highlight mt-4"
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
                          <div style={{ padding: "2rem" }}>
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
                );
              }
            }
          ]}
        />
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};
