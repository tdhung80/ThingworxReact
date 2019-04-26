import React from "react";
//import { Button } from "react-bootstrap";
//import { Button } from "mdbreact"
import Button from "muicss/lib/react/button";

function ActionButton(props) {
  var { inProgress, ...other } = props;

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
}

export default React.memo(ActionButton);
