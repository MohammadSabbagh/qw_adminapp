import { useState, useEffect, useCallback } from "react";
import { debounce } from "debounce";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';

import { checkLocation, createLocation } from '../util/functions'

const locationFlag = {
  title: false,
  address: false,
  titleAr: false,
  addressAr: false,
  latlng: false
}

const locationEmpty = {
  title: '',
  address: '',
  titleAr: '',
  addressAr: '',
  latlng: '',
}


// language detector
function isRTL(s){
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

var langdic = {
  "arabic" : /[\u0600-\u06FF]/,
  "persian" : /[\u0750-\u077F]/,
  "Hebrew" : /[\u0590-\u05FF]/,
  "Syriac" : /[\u0700-\u074F]/,
  "Bengali" : /[\u0980-\u09FF]/,
  "Ethiopic" : /[\u1200-\u137F]/,
  "Greek and Coptic" : /[\u0370-\u03FF]/,
  "Georgian" : /[\u10A0-\u10FF]/,
  "Thai" : /[\u0E00-\u0E7F]/,
  "english" : /^[a-zA-Z]+$/
    //add other languages her
}

export default ({ history }) => {
  const [saving, setSaving] = useState(false);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [isTitleUnique, setIsTitleUnique] = useState(true);

  const [isChecked, setIsChecked] = useState(false);
  const [checkingId, setCheckingId] = useState(false);

  const [location, setLocation] = useState(locationEmpty);
  const [locationInit, setLocationInit] = useState(locationFlag);

  const updateLocationProp = (prop) => async (e) => {
    const value = e.target.value;
    await setLocation({...location, [prop]:value })
    value && await setLocationInit({...locationInit, [prop]:true })
    if (prop == 'title' && value ) {
      await setCheckingId(true)
      checkTitleUniqueDebounced(value)
    }
  }

  const checkTitleUniqueDebounced = useCallback( debounce((v) => checkTitleUnique(v), 500), []);

  const checkTitleUnique = async v => {
    const locationId = v.replace(/[\.\_\-]+/g, '').toLowerCase();
    const isLocationExist = await checkLocation(locationId)
    console.log('isLocationExist',isLocationExist, locationId);
    await setIsTitleUnique(!isLocationExist)
    await setCheckingId(false)

  }

  const createLocationAction = async () => {
    const locationId = location.title.replace(/[\.\_\-]+/g, '').toLowerCase();
    await createLocation(locationId,location);
    console.log('location created',location);
    history.replace(`/${locationId}`);
  }

  const titleHelper =
    locationInit.title
    ? !!location.title
      ? isTitleUnique
        ? 'title is Unique'
        : ' Title already exist'
      : 'Must be filled'
    : '';

    const latlngHelpeer =
      locationInit.latlng
      ? !!location.latlng
        ? /^\s*\d+\.\d+,\s*\d+\.\d+\s*$/.test(location.latlng)
          ? 'latlng is valid'
          : ' value is not valid, ex: 24.461944, 54.324444'
        : 'Must be filled'
      : 'ex: 24.461944, 54.324444';

  const isLatlngValid = /^\s*\d+\.\d+,\s*\d+\.\d+\s*$/.test(location.latlng);
  const isTitleArEnglish = /^[a-zA-Z]+$/.test(location.titleAr);
  const isAddressArEnglish = /^[a-zA-Z]+$/.test(location.addressAr);
  const isValid = isNotEmpty && isTitleUnique && isLatlngValid;


  const locationError = {
    title: locationInit.title && (!location.title || !isTitleUnique),
    address: locationInit.address && !location.address,
    titleAr: locationInit.titleAr && !location.titleAr,
    addressAr: locationInit.addressAr && !location.addressAr,
    latlng: locationInit.latlng && (!location.latlng || !isLatlngValid)
  }


  useEffect(() => {
    const hasEmptyValues = Object.values(location).includes('')
    setIsNotEmpty( !hasEmptyValues )

  console.log('isTitleUnique',isTitleUnique);

  },[location]);

  return (
    <div className="page location">
      <h2>
      <Link className="backLink" to={`/`}><ArrowBackIcon /></Link>
      Create New location</h2>
      {/*{ updated && <div>Updated date please save for changes to take effect.</div>}*/}
      <TextField
        label="Title"
        value={location.title}
        onChange={updateLocationProp('title')}
        error={ locationError.title }
        helperText={ titleHelper}
        InputProps={{
          endAdornment: <InputAdornment position="end"><CircularProgress size={checkingId?16:0} /></InputAdornment>,
        }}

      />
      <TextField
        label="Address"
        value={location.address}
        onChange={updateLocationProp('address')}
        error={ locationError.address }
        helperText={ locationError.address && 'Must be filled' }
      />
      <TextField
        label="Arabic Title"
        value={location.titleAr}
        onChange={updateLocationProp('titleAr')}
        className="rtl"
        error={ locationError.titleAr }
        helperText={ locationError.titleAr && 'Must be filled' }
       />
      <TextField
        label="Arabic Address"
        value={location.addressAr}
        onChange={updateLocationProp('addressAr')}
        className="rtl"
        error={ locationError.addressAr }
        helperText={ locationError.addressAr && 'Must be filled' }
      />
      <TextField
        label="LatLng"
        value={location.latlng}
        onChange={updateLocationProp('latlng')}
        error={ locationError.latlng }
        helperText={ latlngHelpeer }
      />

      <div className="footer">
      <span />
        <Button variant="contained" size="small" color="primary" disabled={!isValid || saving } onClick={createLocationAction}>
          {
            saving
              ? 'Creating'
              : 'Create'
          }
        </Button>
      </div>
    </div>
  );
};
