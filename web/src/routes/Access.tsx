import { useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function Access() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service");

  const queryGrantAccess = useUserStore(state => state.queryGrantAccess);
  const authorized = useUserStore(state => state.authorized);

  const accept = async () => {

  }

  const reject = async () => {

  }

  return (
    <>
    </>
  )
}

export default Access