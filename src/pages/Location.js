import { useState, useEffect, useCallback } from "react";
import { debounce } from "debounce";
import { Link, useParams } from "react-router-dom";
import Header from '../components/Header'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { getLocation, updateLocation, checkCam, createCam } from '../util/functions'

const locationFlag = {
  title: false,
  address: false,
  arabicTitle: false,
  arabicAddress: false,
  latlng: false,
  default: false,
  cams:false
}

export default ({history } ) => {
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCamId, setNewCamId] = useState('');
  const [checkingId, setCheckingId] = useState(false);
  const [isCamUnique, setIsCamUnique] = useState(true);

  const [location, setLocation] = useState();
  const [locationCopy, setLocationCopy] = useState();
  const [locationState, setLocationState] = useState({});

  const { locationId } = useParams();

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

  const updateCam = camKey => e => {
    const value = e.target.value;
    //const camsNew = Object.assign({},location.cams, {[camKey]:value});
    const camsNew = { ...location.cams , [camKey]:value}
    const locationNew = {...location, cams: camsNew }
    //console.log('camsNew',camsNew);

    setLocation(locationNew)
    console.log('locations',location);

    const camsState = JSON.stringify(camsNew) != JSON.stringify(locationCopy.cams)
    console.log('a',JSON.stringify(camsNew));
    console.log('a',JSON.stringify(locationCopy.cams));
    console.log('camsState',camsState);
    //const stateObj = Object.assign(locationState, {[prop]:newStateValue})
    const stateObj = {...locationState, cams:camsState}
    setLocationState(stateObj)

    const isUpdated = Object.values(stateObj).includes(true)
    setUpdated( isUpdated )
  }

  const setDefault = (camId) => {
    updateLocationObj('default',camId)
    console.log('set default',camId);
  }

  const saveLocation = async () => {
    await setSaving(true)
    await updateLocation( locationId, location )
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

  const updateNewCamId = (e) => {
    const value = e.target.value;
    const valueStripped = value.replace(/[\s\.\_\-]+/g, '').toLowerCase();
    setNewCamId(valueStripped)
    if (value){
      setCheckingId(true)
      checkCamUniqueDebounced(valueStripped)
    }

  }

  const checkCamUniqueDebounced = useCallback( debounce((v) => checkCamUnique(v), 500), []);

  const checkCamUnique = async v => {
    const camId = v.replace(/[\s\.\_\-]+/g, '').toLowerCase();
    const isCamExist = await checkCam(camId)
    console.log('isCamExist',isCamExist);
    await setIsCamUnique(!isCamExist)
    await setCheckingId(false)
  }

  const addCam = async () => {
    let camsNew, locationNew, isFirstCam;
    if(location.cams){
      camsNew = { ...location.cams , [newCamId]:'dir'}
      locationNew = {...location, cams: camsNew }
    } else {
      console.log('catcha');
      isFirstCam = true
      camsNew =
      locationNew = {...location, cams: { [newCamId]:'dir'}, default:newCamId }
    }
    await setLocation(locationNew)

    //await setDefault(newCamId)
    //await createCam(locationId, newCamId)

    closeModal()
  }

  const closeModal = () => { setIsModalOpen(false) }
  const openModal = () => { setIsModalOpen(true) }

  useEffect(() => {


  },[location]);

  useEffect(() => {

    const start = async () => {
      //let locationObj;
      try {
         const locationObj= await getLocation(locationId);
         await setLocation(locationObj)
         await setLocationCopy(locationObj)
         await setLoaded(true)
      } catch (error) {
        console.log(error);
        history.replace("/");
      }

    }

    start()
  },[]);

  return (
    <div className="location">
    <Header />
      {
        loaded &&
        <div className="page">
          <h2>
          <Link className="backLink" to={`/`}><ArrowBackIcon /></Link>
          { locationCopy.title }</h2>
          {/*{ updated && <div>Updated date please save for changes to take effect.</div>}*/}
          <TextField label="Title" value={location.title} onChange={updateLocationProp('title')} />
          <TextField label="Address" value={location.address} onChange={updateLocationProp('address')} />
          <TextField label="Arabic Title" value={location.titleAr} onChange={updateLocationProp('titleAr')} className="rtl" />
          <TextField label="Arabic Address" value={location.addressAr} onChange={updateLocationProp('addressAr')} className="rtl" />
          <TextField label="LatLng" value={location.latlng} onChange={updateLocationProp('latlng')} />

          <h3>Cam List</h3>
          <div className="camList">
          {
            location.cams && Object.keys(location.cams).map(camKey => (
              <TextField
                key={camKey}
                placeholder="direction"
                variant="outlined"
                value={location.cams[camKey]}
                onChange={updateCam(camKey)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{ camKey }</InputAdornment>,
                  endAdornment: <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setDefault(camKey)}
                    >
                    { location.default ==  camKey ? <StarIcon style={{ color: '#e5e505' }}/> : <StarBorderIcon /> }
                    </IconButton></InputAdornment>,
                }}
              />
            ))
          }
          <Button variant="contained" onClick={openModal} fullWidth>
            Add New Cam
          </Button>
          </div>

          <Dialog open={isModalOpen} onClose={closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle>Add New Cam</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add new camera, please enter a unique cam id here.
              </DialogContentText>
              <TextField
                label="CAM ID"
                value={newCamId}
                onChange={updateNewCamId}
                error={ !isCamUnique }
                helperText={ !isCamUnique && 'Existed Cam ID '}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="start">{
                     <CircularProgress size={checkingId?16:0} />
                  }</InputAdornment>,
                }}

              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="primary">
                Cancel
              </Button>
              <Button onClick={addCam} color="primary" disabled={!isCamUnique || !newCamId}>
                Add
              </Button>
            </DialogActions>
          </Dialog>

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
      }
    </div>
  );
};
