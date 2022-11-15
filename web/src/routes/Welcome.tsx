import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"

function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <h3>{t("welcome")}</h3>
      <button onClick={() => { navigate("/login") }}>login</button>
      <br />
      <button onClick={() => { navigate("/signup") }}>signup</button>
      <br />
      <button onClick={() => { navigate("/change_password") }}>forgot password</button>
    </>
  )
}

export default Welcome