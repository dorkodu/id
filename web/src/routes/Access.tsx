import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Access() {
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
      <button onClick={accept}>accept</button>
      <button onClick={reject}>reject</button>
    </>
  )
}

export default Access