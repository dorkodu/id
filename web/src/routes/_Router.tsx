import CenterLoader from "@/components/loaders/CenterLoader";
import React, { Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import App from "../App";
import { useWait } from "../components/hooks";
import RequireAuth from "../components/RequireAuth";

// Lazy routes \\
const LazyWelcome = React.lazy(useWait(() => import("./Welcome")));
const LazyLogin = React.lazy(useWait(() => import("./Login")));
const LazySignup = React.lazy(useWait(() => import("./Signup")));
const LazyAccess = React.lazy(useWait(() => import("./Access")));
const LazyConfirmChangeEmail = React.lazy(useWait(() => import("./ConfirmChangeEmail")));
const LazyRevertChangeEmail = React.lazy(useWait(() => import("./RevertChangeEmail")));
const LazyConfirmChangePassword = React.lazy(useWait(() => import("./ConfirmChangePassword")));
const LazyChangePassword = React.lazy(useWait(() => import("./ChangePassword")));

const LazyDashboard = React.lazy(useWait(() => import("./Dashboard")));
const LazySessions = React.lazy(useWait(() => import("./Sessions")));
const LazyAccesses = React.lazy(useWait(() => import("./Accesses")));
const LazyMenu = React.lazy(useWait(() => import("./Menu")));
const LazyChangeEmail = React.lazy(useWait(() => import("./ChangeEmail")));

const LazyNotFound = React.lazy(useWait(() => import("./NotFound")));
// Lazy routes \\

// Lazy layouts \\
const DashboardLayout = React.lazy(useWait(() => import("../components/layouts/DashboardLayout")));
//const PageLayout = React.lazy(useWait(() => import("../components/layouts/PageLayout")));
// Lazy layouts \\

const Welcome = <Suspense fallback={<CenterLoader />}><LazyWelcome /></Suspense>
const Login = <Suspense fallback={<CenterLoader />}><LazyLogin /></Suspense>
const Signup = <Suspense fallback={<CenterLoader />}><LazySignup /></Suspense>
const Access = <Suspense fallback={<CenterLoader />}><LazyAccess /></Suspense>
const ConfirmChangeEmail = <Suspense fallback={<CenterLoader />}><LazyConfirmChangeEmail /></Suspense>
const RevertChangeEmail = <Suspense fallback={<CenterLoader />}><LazyRevertChangeEmail /></Suspense>
const ConfirmChangePassword = <Suspense fallback={<CenterLoader />}><LazyConfirmChangePassword /></Suspense>
const ChangePassword = <Suspense fallback={<CenterLoader />}><LazyChangePassword /></Suspense>

const Dashboard = <Suspense fallback={<CenterLoader />}><LazyDashboard /></Suspense>
const Sessions = <Suspense fallback={<CenterLoader />}><LazySessions /></Suspense>
const Accesses = <Suspense fallback={<CenterLoader />}><LazyAccesses /></Suspense>
const Menu = <Suspense fallback={<CenterLoader />}><LazyMenu /></Suspense>
const ChangeEmail = <Suspense fallback={<CenterLoader />}><LazyChangeEmail /></Suspense>

const NotFound = <Suspense fallback={<CenterLoader />}><LazyNotFound /></Suspense>

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Navigate to "/dashboard" on path "/" */}
      <Route index element={<Navigate to="/dashboard" />} />

      {/* Routes that don't require authentication */}
      <Route path="/welcome" element={Welcome} />
      <Route path="/login" element={Login} />
      <Route path="/create-account" element={Signup} />
      <Route path="/access" element={Access} />
      <Route path="/change-password" element={ChangePassword} />
      <Route path="/confirm-email-change" element={ConfirmChangeEmail} />
      <Route path="/revert-email-change" element={RevertChangeEmail} />
      <Route path="/confirm-password-change" element={ConfirmChangePassword} />

      {/* Routes that require authentication */}
      <Route element={<RequireAuth />}>
        <Route element={<Suspense fallback={<CenterLoader />}><DashboardLayout /></Suspense>}>
          <Route path="/dashboard" element={Dashboard} />
          <Route path="/sessions" element={Sessions} />
          <Route path="/accesses" element={Accesses} />
          <Route path="/menu" element={Menu} />
        </Route>
        <Route path="/change-email" element={ChangeEmail} />
      </Route>

      {/* Error routes & catch all */}
      <Route path="/404" element={NotFound} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
  )
)
