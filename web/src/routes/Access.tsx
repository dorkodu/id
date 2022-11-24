import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Access() {
  const [status, setStatus] = useState({ done: false, error: false });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const service = searchParams.get("service");

  const queryGrantAccess = useUserStore(state => state.queryGrantAccess);
  const authorized = useUserStore(state => state.authorized);

  const gotoLogin = () => {
    navigate(`/login?redirect=${location.pathname}${location.search}`)
  }

  const gotoSignup = async () => {
    navigate(`/signup?redirect=${location.pathname}${location.search}`)
  }

  const gotoDashboard = () => {
    navigate("/dashboard");
  }

  const accept = async () => {
    if (!service) return;
    const success = await queryGrantAccess(service);
    setStatus({ done: true, error: !success });
    document.location.href = `http://${service}`;
  }

  const reject = async () => {
    navigate("/dashboard");
  }

  if (!service) return (
    (
      <>
        error: service is not specified
        <br />
        <button onClick={gotoDashboard}>goto dashboard</button>
      </>
    )
  )

  if (!authorized) return (
    (
      <>
        please login or signup to continue
        <br />
        <button onClick={gotoLogin}>login</button>
        <button onClick={gotoSignup}>signup</button>
      </>
    )
  )

  return (
    <>
      {service}
      <br />
      wants to use your dorkodu id account for authentication
      <br />
      your user id, username, email, and join date will be shared
      <br />
      <button onClick={accept}>accept</button>
      <button onClick={reject}>reject</button>
      <br />
      {status.done && status.error && <>an error occured. please try again.</>}
    </>
  )
}

export default Access