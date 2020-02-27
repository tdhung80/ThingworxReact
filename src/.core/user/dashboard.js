import React, { lazy } from "react";

// const AdminPage = lazy(() => import("../layout/admin"));
const UserPage = lazy(() => import("../layout/user"));

export default () => {
  // https://github.com/STRML/react-grid-layout
  // https://demo.mobiscroll.com/javascript/cards/accordion#theme=ios-dark
  // https://blog.bitsrc.io/12-react-ui-layout-grid-components-and-libraries-for-2019-16e8aa5d0b08


  return (
    <UserPage>
      <div>Dashboard</div>
    </UserPage>
  );
};
