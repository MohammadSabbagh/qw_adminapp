import { useEffect, useState, useCallback  } from 'react';
import { Link } from "react-router-dom";
import { getLocations } from '../util/functions';
import Header from '../components/Header'
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

export default () => {
  const [locations, setLocations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const start = async () => {
      const locationsList = await getLocations();
      await setLocations(locationsList)
      await setLoaded(true)
    }

    start()
  },[]);

  return (
      <div className="locationsPage">
        <Header />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item><h1>Locations</h1></Grid>
          <Grid item className="m3" >
            {/*<Link to={`/new`}>Add New</Link>*/}
            <Button
              variant="outlined"
              color="default"
              startIcon={<AddIcon />}
              href={`/new`}
            >
              Add New
            </Button>
          </Grid>
        </Grid>

        <ul id="locations_list">
        {
          loaded && locations.map(location => (
            <li key={location.locationId}>
              <Link to={`/${location.locationId}`}>{ location.title }</Link>
            </li>
          ))
        }
        </ul>
      </div>
  );
}
