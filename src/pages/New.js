import { useState, useEffect } from "react";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getLocation, updateLocation } from '../util/functions'

const locationFlag = {
  title: false,
  address: false,
  arabicTitle: false,
  arabicAddress: false,
  latlng: false,
  default: false,
  cams:false
}

const locationEmpty = {
  title: '',
  address: '',
  arabicTitle: '',
  arabicAddress: '',
  latlng: '',
}

export default () => {
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [location, setLocation] = useState(locationEmpty);
  const [locationCopy, setLocationCopy] = useState();
  const [locationState, setLocationState] = useState({});

  const updateLocationObj = (prop, value) => {

    setLocation({...location, [prop]:value })

    // update state
    const newStateValue = value == locationCopy[prop] ? false : true;
    const stateObj = Object.assign(locationState, {[prop]:newStateValue})
    setLocationState( stateObj )

    const isUpdated = Object.values(stateObj).includes(true)
    setUpdated( isUpdated )
  }

  const updateLocationProp = (prop) => (e) => {
    const value = e.target.value;
    updateLocationObj(prop,value)
  }

  const saveLocation = async () => {
    await setSaving(true)
    //await updateLocation( locationId, location )
    await setLocationCopy(location)
    await setLocationState(locationFlag)
    await setUpdated(false)
    await setSaving(false)
  }

  const resetLocation = async () => {
    await setLocation(locationCopy)
    await setLocationState(locationFlag)
    await setUpdated(false)
  }


  useEffect(() => {

  },[]);

  return (
    <div className="page location">
          <h2>
          <Link className="backLink" to={`/`}><ArrowBackIcon /></Link>
          Create New location</h2>
          {/*{ updated && <div>Updated date please save for changes to take effect.</div>}*/}
          <TextField label="Title" value={location.title} onChange={updateLocationProp('title')} />
          <TextField label="Address" value={location.address} onChange={updateLocationProp('address')} />
          <TextField label="Arabic Title" value={location.titleAr} onChange={updateLocationProp('titleAr')} className="rtl" />
          <TextField label="Arabic Address" value={location.addressAr} onChange={updateLocationProp('addressAr')} className="rtl" />
          <TextField label="LatLng" value={location.latlng} onChange={updateLocationProp('latlng')} />

          <div className="footer">
            <Button size="small"  onClick={resetLocation} disabled={!updated}>
              Reset
            </Button>
            <Button variant="contained" size="small" color="primary" disabled={!updated || saving } onClick={saveLocation}>
              {
                saving
                  ? 'Saveing'
                  : updated
                    ? 'Save'
                    : 'Saved'
              }
            </Button>
          </div>
    </div>
  );
};
