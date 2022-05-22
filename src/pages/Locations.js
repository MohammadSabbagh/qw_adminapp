import { useEffect, useState, useCallback  } from 'react';
import { Link } from "react-router-dom";
import { getLocations } from '../util/functions';
import Header from '../components/Header'
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { updateLocationVis } from '../util/functions'

export default () => {
  const [locations, setLocations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const toggleVis = async ( id, index ) => {
    console.log('locations vis',id, locations[index]);
    const vis = !locations[index].visible
    console.log('vis',vis);
    const loactionsCopy = [...locations]
    loactionsCopy[index].visible = vis
    setLocations(loactionsCopy)
    await updateLocationVis(id , vis)

  }

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
        <div className="locations-header fixed-width">
          <h1>Locations</h1>
          <Button
            variant="outlined"
            color="default"
            startIcon={<AddIcon />}
            href={`/new`}
            className="m3"
          >
            Add New
          </Button>
        </div>

        <ul className="locations_list fixed-width">
        {
          loaded && locations.map((location, index) => (
            <li key={location.locationId}>
              <Link to={`/${location.locationId}`}>{ location.title }</Link>
              <IconButton
                aria-label="toggle cam visibility"
                onClick={() => toggleVis(location.locationId, index)}
              >
                { location.visible ? <VisibilityIcon /> : <VisibilityOffIcon /> }
              </IconButton>
            </li>
          ))
        }
        </ul>
      </div>
  );
}
