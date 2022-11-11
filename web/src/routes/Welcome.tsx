import { useNavigate } from "react-router-dom"

function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => { navigate("/login") }}>login</button>
      <br />
      <button onClick={() => { navigate("/signup") }}>signup</button>
      <br />
      <button onClick={() => { navigate("/change_password") }}>forgot password</button>
    </>
  )
}

export default Welcome