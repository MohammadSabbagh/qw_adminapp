//import React, {useState} from 'react';
import './style/index.scss';
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";

import Location from './pages/Location'
import Header from './components/Header'
import Locations from "./pages/Locations";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import New from "./pages/New";
import { AuthProvider } from "./util/Auth";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return (
    <AuthProvider>
      <Router>
          <div className="App">
            <Header />
            <main>
                <Switch>
                  <PrivateRoute exact path="/" component={Locations} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/logout" component={Logout} />
                  <PrivateRoute exact path="/new" component={New} />
                  <PrivateRoute exact path="/:locationId" component={Location} />
                </Switch>
            </main>
          </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
