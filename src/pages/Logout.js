import React, { useCallback, useContext } from "react";
import app from "../util/Firebase.js";
import { AuthContext } from "../util/Auth.js";


const Logout = ({ history }) => {

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    console.log('signout');
    app.auth().signOut()
    //history.replace("/login");
  }

  return (
    <div>
      <h1>Log out</h1>
    </div>
  );
};

export default Logout;
