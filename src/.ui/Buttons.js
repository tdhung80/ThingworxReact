import React from "react";
//import { Button } from "react-bootstrap";
//import { Button } from "mdbreact"
import Button from "muicss/lib/react/button";

export const ActionButton = props => {
  var { inProgress, ...other } = props; // don't change var to let/const

  if (inProgress) {
    other = { ...other, disabled: true };
    return (
      <Button {...other}>
        <i className="fa fa-spinner fa-spin" />
        {props.children}
      </Button>
    );
  }
  return <Button {...other} />;
};
