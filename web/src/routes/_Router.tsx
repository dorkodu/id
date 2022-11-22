import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import RequireAuth from "../components/RequireAuth";
import { EmailTypes } from "@shared/email_types";
import Access from "./Access";

const Welcome = React.lazy(() => import("./Welcome"));
const Login = React.lazy(() => import("./Login"));
const Signup = React.lazy(() => import("./Signup"));
const ChangeUsername = React.lazy(() => import("./ChangeUsername"));
const ChangeEmail = React.lazy(() => import("./ChangeEmail"));
const ConfirmChangeEmail = React.lazy(() => import("./ConfirmChangeEmail"));
const RevertChangeEmail = React.lazy(() => import("./RevertChangeEmail"));
const ConfirmChangePassword = React.lazy(() => import("./ConfirmChangePassword"));
const ChangePassword = React.lazy(() => import("./ChangePassword"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const NotFound = React.lazy(() => import("./NotFound"));

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Navigate to "/dashboard" on path "/" */}
          <Route index element={<Navigate to="/dashboard" />} />

          {/* Routes that don't require authentication */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path={`/${EmailTypes.ConfirmEmailChange}`} element={<ConfirmChangeEmail />} />
          <Route path={`/${EmailTypes.RevertEmailChange}`} element={<RevertChangeEmail />} />
          <Route path={`/${EmailTypes.ConfirmPasswordChange}`} element={<ConfirmChangePassword />} />

          {/* Routes that require authentication */}
          <Route element={<RequireAuth />}>
            <Route path="/access" element={<Access />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/change_username" element={<ChangeUsername />} />
            <Route path="/change_email" element={<ChangeEmail />} />
          </Route>

          {/* Error routes & catch all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router