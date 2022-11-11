import React from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import App from "../App";

const Welcome = React.lazy(() => import("./Welcome"));
const Login = React.lazy(() => import("./Login"));
const Signup = React.lazy(() => import("./Signup"));
const Dashboard = React.lazy(() => import("./Dashboard"));

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router