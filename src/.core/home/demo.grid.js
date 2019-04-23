import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  ActionButton as Button,
  Modal,
  ProgressBar,
  i18n
} from "../../.ui";
// import { ReactDataGrid, Editors } from "../../.ui/ListView";
import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";
import Page from "../layout/page";
import { fakeAPI } from "../../services";

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
  {
    key: "complete",
    name: "Complete",
    formatter: ({ value }) => <ProgressBar now={value} />
  },
  {
    key: "issueType",
    name: "Task Type",
    editor: (
      <Editors.DropDownEditor
        options={[
          { id: "bug", value: "Bug" },
          { id: "epic", value: "Epic" },
          { id: "story", value: "Story" }
        ]}
      />
    )
  }
];

// dataModel
const rows = [
  { id: 0, title: "Task 1", issueType: "Bug", complete: 20 },
  { id: 1, title: "Task 2", issueType: "Story", complete: 40 },
  { id: 2, title: "Task 3", issueType: "Epic", complete: 60 }
];

export default props => {
  const [state, setState] = useState({ rows });

  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  const handleAction = () => {
    console.log(state.rows);
  };

  // Toolbar Actions / Filter
  // Column: Actions
  // FilterRow / CurrentEditingRow
  // Footer : Paging / RowCount

  return (
    <Page>
      <Modal.Dialog size="lg">
        <Modal.Header>
          <h1>{i18n.text("Demo Grid")}</h1>
        </Modal.Header>

        <Modal.Body>
          <div>
            <ReactDataGrid
              columns={columns}
              rowGetter={i => state.rows[i]}
              rowsCount={3}
              onGridRowsUpdated={onGridRowsUpdated}
              enableCellSelect={true}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAction}
            //inProgress={inProgress}
          >
            {i18n.action("Process")}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Page>
  );
};
