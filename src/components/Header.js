import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from "react-router-dom";
import logo from '../assets/logowhitesmall.png';

export default () => {

  return (
    <div id="header">
      <AppBar position="static">
        <Toolbar>
          <img id="logo" src={logo} />
          <Link to="/logout" className="link" alt="">Logout</Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
