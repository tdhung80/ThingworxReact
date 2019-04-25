import React from "react";
//import "./blank.scss";

export default props => {
  return <div>{props.children}</div>;
  return (
    <div class="stage">
      <div class="layer" data-text="Welcome" />
      <div>{props.children}</div>
    </div>
  );
};
