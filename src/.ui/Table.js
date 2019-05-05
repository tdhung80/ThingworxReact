import React, { Component } from "react";
import Table, { ReactTableDefaults } from "react-table";

//https://github.com/tannerlinsley/react-table
//https://react-table.js.org/
import "react-table/react-table.css";

Object.assign(ReactTableDefaults, {
  defaultPageSize: 10,
  minRows: 3
});

class ReactTable extends Component {
  constructor(props) {
    super(props);
    this.dragged = null;
    this.reorder = [];
    this.state = {
      trigger: 0
    };

    // "react-table/lib/hoc/*"
    //    const SelectTreeTable = selectTableHOC(treeTableHOC(ReactTable));
    //    const ColumnDraggableTable = columnDraggleHOC(ReactTable)
    //
    // TODO: Add draggable property
    // TODO: https://github.com/tannerlinsley/react-table/tree/v6#selecttable
    //       selection row https://codepen.io/aaronschwartz/pen/WOOPRw
    //       https://stackoverflow.com/questions/44845372/select-row-on-click-react-table
    //
  }
  mountEvents() {
    // TODO: search from .esr-table

    const headers = Array.prototype.slice.call(document.querySelectorAll(".draggable-header"));

    headers.forEach((header, i) => {
      header.setAttribute("draggable", true);
      //the dragged header
      header.ondragstart = e => {
        e.stopPropagation();
        this.dragged = i;
      };

      header.ondrag = e => e.stopPropagation;

      header.ondragend = e => {
        e.stopPropagation();
        setTimeout(() => (this.dragged = null), 1000);
      };

      //the dropped header
      header.ondragover = e => {
        e.preventDefault();
      };

      header.ondrop = e => {
        e.preventDefault();
        const { target, dataTransfer } = e;
        this.reorder.push({ a: i, b: this.dragged });
        this.setState({ trigger: Math.random() });
      };
    });
  }
  componentDidMount() {
    this.mountEvents();
  }

  componentDidUpdate() {
    this.mountEvents();
  }
  render() {
    const { data, columns } = this.props;

    const cols = columns.map(col => ({
      ...col,
      Header: <span className="draggable-header">{col.Header}</span>
    }));

    //run all reorder events
    this.reorder.forEach(o => cols.splice(o.a, 0, cols.splice(o.b, 1)[0]));

    //render
    return (
      <div className="esr-table">
        <Table {...this.props} data={data} columns={cols} />
      </div>
    );
  }
}

export default ReactTable;
