import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import { routes } from "./_routes";

const Welcome = React.lazy(() => import("./Welcome"));
const Login = React.lazy(() => import("./Login"));
const Signup = React.lazy(() => import("./Signup"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const NotFound = React.lazy(() => import("./NotFound"));

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="welcome" />} />

          <Route path={routes.welcome.path} element={<Welcome />} />
          <Route path={routes.login.path} element={<Login />} />
          <Route path={routes.signup.path} element={<Signup />} />
          <Route path={routes.dashboard.path} element={<Dashboard />} />

          <Route path={routes.notFound.path} element={<NotFound />} />
          <Route path="*" element={<Navigate to={routes.notFound.path} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router