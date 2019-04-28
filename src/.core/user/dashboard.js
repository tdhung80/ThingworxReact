import React, { lazy } from "react";

// const AdminPage = lazy(() => import("../layout/admin"));
const UserPage = lazy(() => import("../layout/user"));

export default () => {
  return (
    <UserPage>
      <div>Dashboard</div>
    </UserPage>
  );
};
