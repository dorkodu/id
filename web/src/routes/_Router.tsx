import React from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import App from "../App";
import { useWait } from "../components/hooks";
import RequireAuth from "../components/RequireAuth";
import Access from "./Access";

const Welcome = React.lazy(useWait(() => import("./Welcome")));
const Signup = React.lazy(useWait(() => import("./Signup")));
const Login = React.lazy(useWait(() => import("./Login")));
const ChangeEmail = React.lazy(useWait(() => import("./ChangeEmail")));
const ConfirmChangeEmail = React.lazy(useWait(() => import("./ConfirmChangeEmail")));
const RevertChangeEmail = React.lazy(useWait(() => import("./RevertChangeEmail")));
const ConfirmChangePassword = React.lazy(useWait(() => import("./ConfirmChangePassword")));
const ChangePassword = React.lazy(useWait(() => import("./ChangePassword")));
const Dashboard = React.lazy(useWait(() => import("./Dashboard")));
const NotFound = React.lazy(useWait(() => import("./NotFound")));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Navigate to "/dashboard" on path "/" */}
      <Route index element={<Navigate to="/dashboard" />} />

      {/* Routes that don't require authentication */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<Signup />} />
      <Route path="/access" element={<Access />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/confirm-email-change" element={<ConfirmChangeEmail />} />
      <Route path="/revert-email-change" element={<RevertChangeEmail />} />
      <Route path="/confirm-password-change" element={<ConfirmChangePassword />} />

      {/* Routes that require authentication */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-email" element={<ChangeEmail />} />
      </Route>

      {/* Error routes & catch all */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
  )
)
