import React, { useCallback, useContext, useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../util/Auth.js";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import app from "../util/Firebase.js";
import logo from '../assets/logowhitesmall.png';


const Login = ({ history, location }) => {
  const [valid, setValid] = useState(true);
  const [loading,setLoading] = useState(false)

  const handleLogin = useCallback(
    async event => {
      setLoading(true);
      event.preventDefault();
      const { username, password } = event.target.elements;
      //const pass = Hex.stringify(sha256(password.value));
      const pass = password.value;
      const email = username.value;

      app.auth().signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log('user',user);
        setLoading(false);
        history.replace("/");
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('wrong username or password');
        setLoading(false);
        setValid(false)
      });

    },
    [history]
  );

  useEffect(() => {
    console.log('location',location);
    let params = new URLSearchParams(location.search.substring(1));
    let s = params.get("s")
    console.log(s);
    if (s){
      console.log('singing in ');
      app.auth().signInWithEmailAndPassword('default@ncmi.ae', s)
      .then((userCredential) => {
        var user = userCredential.user;
        console.log('user',user);
        history.replace("/");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('invalid token');
      });
    }
   }, [location]);

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div id="login">
      <img id="logoLogin" src={logo} />
      <h3>Camera Netwrok - Admin Panel</h3>
      <form onSubmit={handleLogin} noValidate autoComplete="off">
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        {
          !valid && <p className="error">wrong username or password</p>
        }

        <Button variant="contained" type="submit" fullWidth color="primary" disabled={loading}>{ loading ? 'loading' : 'Log in'}</Button>
      </form>
    </div>
  );
};

export default withRouter(Login);
