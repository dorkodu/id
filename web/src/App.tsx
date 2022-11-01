import { useState } from "react"

interface State {
  user: IUser | undefined;
  authorized: boolean;
}

interface IUser {
  id: number;
  username: string;
  email: string;
  joinedAt: number;
}

function App() {
  const [state, setState] = useState<State>({ user: undefined, authorized: false });

  return (
    <>
      {!state.authorized &&
        <>
          <div><input type={"text"} placeholder={"username or email..."} /></div>
          <div><input type={"password"} placeholder={"password..."} /></div>
          <button>login</button>
          <br /><br />
          <div><input type={"text"} placeholder={"username..."} /></div>
          <div><input type={"email"} placeholder={"email..."} /></div>
          <div><input type={"password"} placeholder={"password..."} /></div>
          <button>signup</button>
        </>
      }
      {state.authorized && state.user &&
        <>
          <div>username: {state.user.username}</div>
          <div>email: {state.user.email}</div>
          <div>joined at: {new Date(state.user.joinedAt * 1000).toString()}</div>
          <br />

          <div>
            change username:
            <div><input type={"text"} placeholder={"new username..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <div>
            change email:
            <div><input type={"text"} placeholder={"new email..."} /></div>
            <div><input type={"password"} placeholder={"password..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <div>
            change password:
            <div><input type={"password"} placeholder={"old password..."} /></div>
            <div><input type={"password"} placeholder={"new username..."} /></div>
            <button>apply</button>
          </div>
          <br />

          <button>logout</button>
        </>
      }
    </>
  )
}

export default App
