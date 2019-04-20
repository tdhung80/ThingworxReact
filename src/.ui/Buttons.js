import React from "react";
import { Button as BSButton } from "reactstrap";

export function Button(props) {
  var { inProgress, ...other } = props;

  if (inProgress) {
    other = { ...other, disabled: true };
    return (
      <BSButton {...other}>
        <i className="fa fa-spinner fa-spin" />
        {props.children}
      </BSButton>
    );
  }
  return <BSButton {...other} />;
}
