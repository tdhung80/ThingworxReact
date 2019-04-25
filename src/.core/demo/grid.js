import React, { useState, useRef, useEffect } from "react";
import { Alert, ActionButton, Button, Modal, ProgressBar } from "../../.ui";
import translator from "../../.ui/Translator";
import ReactDataGrid from "react-data-grid";
import { fakeAPI } from "../../services";

const {
  Editors,
  Toolbar,
  Data,
  DraggableHeader: { DraggableContainer },
  Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter },
  Menu: { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger }
} = require("react-data-grid-addons");
const selectors = Data.Selectors;

const i18n = translator("FORM_GRID_DEMO");

const IssueType = ["bug", "epic", "story"].map(p => {
  return { id: p, value: p, text: i18n.data(p, "IssueType") };
});

const GridColumnHeader = ({ column, ...props }) => {
  console.log(props);
  return <div>{column.name}</div>;
};

//
// use this to check which features are working together
//
const draggable = v => false;
const editable = v => false;
const filterable = v => true;
const frozenable = v => true;
const resizable = v => true;
const sortable = v => true;
const rowHeader = v => true;
// BUG: draggable will break resizable

const columns = [
  /*{
    key: "id",
    name: i18n.label("ID"),
    width: 50,
    draggable: false,
    filterable: false,
    resizable: false,
    frozen: frozenable(true)
  },*/
  {
    key: "title",
    name: i18n.label("Title"),
    width: 140,
    draggable: draggable(false),
    editable: editable(true),
    frozen: frozenable(true)
    //sortDescendingFirst: true
    //headerRenderer: <GridColumnHeader />
  },
  {
    key: "complete",
    name: i18n.label("Complete"),
    width: 120,
    formatter: ({ value }) => <ProgressBar now={value} />
  },
  {
    key: "issueType",
    name: i18n.label("Type"),
    filterRenderer: MultiSelectFilter,
    formatter: ({ value }) => <div style={{ textAlign: "center" }}>{i18n.data(value, "IssueType")}</div>,
    editor: <Editors.DropDownEditor options={IssueType} />
  },
  {
    key: "score",
    name: i18n.label("Score"),
    width: 80,
    filterRenderer: NumericFilter,
    formatter: ({ value }) => <div style={{ textAlign: "right", paddingRight: "10px" }}>{value}</div>,
    editable: editable(true)
    // TODO: style right
  },
  {
    key: "result",
    name: i18n.label("Result"),
    filterRenderer: SingleSelectFilter, // TODO: tri-state checkbox
    editable: editable(true),
    //editor: <Editors.CheckboxEditor />, TODO: click to change cell value directly
    formatter: ({ value }) => {
      if (value) {
        // TODO: style center
        return (
          <div
            className="form-check"
            style={{
              textAlign: "center"
            }}
          >
            <input type="checkbox" className="form-check-input" defaultChecked />
            <label
              className="form-check-label"
              style={{
                paddingLeft: "25px"
              }}
            />
          </div>
        );
      }
      return <></>;
    }
  },
  {
    key: "actions",
    name: i18n.label("Actions"),
    editable: false,
    draggable: false,
    filterable: false,
    resizable: false,
    sortable: false,
    width: 170,
    formatter: ({ row }) => {
      //console.log(row.id)
      return (
        <>
          <Button variant="primary" size="sm">
            Action 1
          </Button>
          <Button variant="primary" size="sm">
            Action 2
          </Button>
        </>
      );
    }
  }
].map(c => ({
  draggable: draggable(true),
  filterable: filterable(true),
  resizable: resizable(true),
  sortable: sortable(true),
  ...c,
  events: {
    onDoubleClick: (ev, args) => console.log(`onDoubleClick at {${args.rowIdx}x${args.rowId}}`),
    onContextMenu: function(ev) {
      console.log(`Context Menu is opened` + arguments.length);
    }
  }
}));

// dataModel
const rows = [...Array(10).keys()].map(idx => {
  return {
    id: idx * 10,
    title: `Task ${idx}`,
    issueType: ["bug", "story", "epic"][idx % 3],
    complete: 100 * Math.random(),
    score: Math.floor(100 * Math.random()),
    result: idx % 2 === 0,
    tasks: [...Array(3).keys()].map(subIdx => {
      return {
        id: idx * 10 + subIdx + 1,
        title: `Task ${idx * 10 + subIdx}`,
        issueType: ["bug", "story", "epic"][subIdx % 3],
        complete: 100 * Math.random(),
        score: Math.floor(100 * Math.random()),
        result: subIdx % 2 === 0,
        tasks: [...Array(3).keys()].map(subIdx1 => {
          return {
            id: idx * 100 + subIdx1 + 1,
            title: `Task ${idx * 100 + subIdx1}`,
            issueType: ["bug", "story", "epic"][(subIdx + subIdx1) % 3],
            complete: 100 * Math.random(),
            score: Math.floor(100 * Math.random()),
            result: (subIdx + subIdx1) % 2 === 0
          };
        })
      };
    })
  };
});

const callFakeAPI = async () => {
  await fakeAPI(true);
};

const getSubRowDetails = expandedRows => rowItem => {
  // TODO lazyload
  const isExpanded = expandedRows[rowItem.id] ? expandedRows[rowItem.id] : false;
  return {
    group: rowItem.tasks && rowItem.tasks.length > 0,
    expanded: isExpanded,
    children: rowItem.tasks,
    field: "title",
    treeDepth: rowItem.treeDepth || 0,
    siblingIndex: rowItem.siblingIndex,
    numberSiblings: rowItem.numberSiblings
  };
};

function updateSubRowDetails(subRows, parentTreeDepth) {
  const treeDepth = parentTreeDepth || 0;
  subRows.forEach((sr, i) => {
    sr.treeDepth = treeDepth + 1;
    sr.siblingIndex = i;
    sr.numberSiblings = subRows.length;
  });
}

const EmptyRowsView = () => {
  const message = "No data to show";
  return (
    <div style={{ textAlign: "center", backgroundColor: "#ddd", padding: "100px" }}>
      <h3>{message}</h3>
    </div>
  );
};

export default props => {
  const [state, setState] = useState({ columns, rows, selectedIndices: [], expandedRows: [] });
  const visibleRows = Data.Selectors.getRows(state);
  const [, setFilters] = useState({});
  const rowText = state.selectedIndices.length <= 1 ? "row" : "rows";

  const onHeaderDrop = (source, target) => {
    var columns = [...state.columns];
    const columnSourceIndex = columns.findIndex(i => i.key === source);
    const columnTargetIndex = columns.findIndex(i => i.key === target);
    console.log(`onHeaderDrop: ${source}:${columnSourceIndex} ${target}:${columnTargetIndex}`);

    columns.splice(columnTargetIndex, 0, columns.splice(columnSourceIndex, 1)[0]);

    setState({ ...state, columns: [] });
    setState({ ...state, columns: columns });
  };

  const onGridRowRender = ({ renderBaseRow, ...props }) => {
    const dataRow = props.row;
    if (Object.keys(dataRow).length === 0) {
      return (
        <div className="react-grid-Row react-grid-Cell" style={{ height: "50px", lineHeight: "50px" }}>
          Loading...
        </div>
      );
    }
    const color = props.idx % 2 ? "green" : "blue";
    return <div style={{ color }}>{renderBaseRow(props)}</div>;
  };

  const GridRowContextMenuRender = ({ idx, id, rowIdx }) => {
    const handleMenuClick = (e, { rowIdx, idx, action }) => {
      console.log(`MenuClick: ${rowIdx}x${idx} "${action}"`);
    };
    return (
      <ContextMenu id={id}>
        <MenuItem data={{ rowIdx, idx, action: "Action 1" }} onClick={handleMenuClick}>
          Action 1
        </MenuItem>
        <SubMenu title="Actions">
          <MenuItem data={{ rowIdx, idx, action: "Action 2" }} onClick={handleMenuClick}>
            Action 2
          </MenuItem>
          <MenuItem data={{ rowIdx, idx, action: "Action 3" }} onClick={handleMenuClick}>
            Action 3
          </MenuItem>
        </SubMenu>
      </ContextMenu>
    );
  };

  const onGridRowsSelected = rows => {
    setState({ ...state, selectedIndices: state.selectedIndices.concat(rows.map(r => r.rowIdx)) });
  };

  const onGridRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setState({
      ...state,
      selectedIndices: state.selectedIndices.filter(i => rowIndexes.indexOf(i) === -1)
    });
  };

  const onGridRowsUpdate = ({ fromRow, toRow, updated }) => {
    setState(state => {
      console.log(`onGridRowsUpdate: ${fromRow}->${toRow} ${JSON.stringify(updated)}`);
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { ...state, rows };
    });
  };

  const onGridSortChange = (sortColumn, sortDirection) => {
    console.log(`onGridSortChange: ${sortColumn} ${sortDirection}`);
  };

  const onGridFiltersChange = filter => {
    console.log(`onFiltersChanged`);
    setFilters(filters => {
      const newFilters = { ...filters };
      if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
      } else {
        delete newFilters[filter.column.key];
      }
      console.log(newFilters);
      return newFilters;
    });
  };
  const onGridFiltersReset = () => {
    console.log(`onGridFiltersReset`);
    // BUG: filterValues are always reset when toggle Filter row
    setFilters({});
  };
  const getValidFilterValues = columnId => {
    console.log(columnId);
    return {
      issueType: IssueType.map(o => o.value),
      result: ["true", "false"]
    }[columnId];
  };

  const getCellActions = (column, row) => {
    return {
      complete: [
        // {
        //   icon: "fa fa-link",
        //   actions: [
        //     {
        //       text: "Option 1",
        //       callback: () => {
        //         alert("Option 1 clicked");
        //       }
        //     },
        //     {
        //       text: "Option 2",
        //       callback: () => {
        //         alert("Option 2 clicked");
        //       }
        //     }
        //   ]
        // },
        {
          icon: "fa fa-link",
          callback: () => {
            console.log("Click on link");
          }
        }
      ]
    }[column.key];
  };

  const handleAction = () => {
    console.log(state.rows);
  };

  // Toolbar Actions / Filter
  // Column: Actions
  // Footer : Paging / RowCount

  const onCellExpand = args => ({ rows, expandedRows }) => {
    const rowKey = args.rowData.id;
    const rowIndex = rows.indexOf(args.rowData);
    const subRows = args.expandArgs.children;
    if (expandedRows && !expandedRows[rowKey]) {
      expandedRows[rowKey] = true;
      updateSubRowDetails(subRows, args.rowData.treeDepth);
      rows.splice(rowIndex + 1, 0, ...subRows);
    } else if (expandedRows[rowKey]) {
      expandedRows[rowKey] = false;
      rows.splice(rowIndex + 1, subRows.length);
    }
    return { ...state, expandedRows, rows };
  };

  const rowGetter = i => {
    // TODO: lazy loading, set loading rows
    if (i >= 8) {
      // a callback to setRow
      return {};
    }
    return visibleRows[i];
  };

  return (
    <Modal.Dialog size="lg">
      <Modal.Header>
        <h1>{i18n.text("Demo Grid")}</h1>
      </Modal.Header>

      <Modal.Body>
        <div>
          <DraggableContainer onHeaderDrop={onHeaderDrop}>
            <ReactDataGrid
              columns={state.columns}
              rowGetter={rowGetter}
              rowsCount={visibleRows.length}
              toolbar={<Toolbar enableFilter={filterable(true)} filterRowsButtonText={i18n.action("Filters")} />}
              rowRenderer={onGridRowRender}
              contextMenu={<GridRowContextMenuRender />}
              onGridRowsUpdated={onGridRowsUpdate}
              onGridSort={onGridSortChange}
              onAddFilter={onGridFiltersChange}
              onClearFilters={onGridFiltersReset}
              onCellExpand={args => setState(onCellExpand(args))}
              // optional
              rowSelection={{
                showCheckbox: rowHeader(true),
                enableShiftSelect: false,
                onRowsSelected: onGridRowsSelected,
                onRowsDeselected: onGridRowsDeselected,
                selectBy: { indexes: state.selectedIndices }
              }}
              getSubRowDetails={getSubRowDetails(state.expandedRows)}
              getValidFilterValues={getValidFilterValues}
              getCellActions={getCellActions}
              emptyRowsView={EmptyRowsView}
              enableCellAutoFocus={false}
              enableCellSelect={editable(true)} // stop copying cell like Excel, but it also stop cell editing ;(
              minHeight={350}
              rowHeight={50}
              RowsContainer={ContextMenuTrigger}
              //
              sortColumn="title"
              sortDirection="ASC"
            />
          </DraggableContainer>
          <div className="mt-2">
            {i18n.format("${selected}/${rowCount} " + rowText + " selected", {
              selected: state.selectedIndices.length,
              rowCount: state.rows.length
            })}
          </div>
        </div>
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
    </Modal.Dialog>
  );
};
