import React, { useState } from "react";
import Login from "./components/Login";
import Voting from "./components/Voting";
import Admin from "./components/Admin";

const App = () => {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      {!account ? (
        <Login setAccount={setAccount} />
      ) : isAdmin ? (
        <Admin />
      ) : (
        <Voting account={account} />
      )}
      <button onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? "Go to Voting" : "Go to Admin Panel"}</button>
    </div>
  );
};

export default App;
