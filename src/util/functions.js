import firebase from '../util/Firebase.js';
const db = firebase.database();

const getLocations = () => new Promise( async (resolve,reject) => {
  const locationsRef = db.ref(`locations`);
  const locationsSnapshot = await locationsRef.once('value');
  const locationsObj = locationsSnapshot.val();
  console.log('locationsObj',locationsObj);
  let camList = [];
  for (const child in locationsObj) {
    const title = locationsObj[child].title;
    const visible = locationsObj[child].visible;
    const locationCams = locationsObj[child].cams ? locationsObj[child].cams.length:0;
    const locationId = child;
    camList.push({
      locationCams: locationCams,
      title: title,
      locationId:locationId,
      visible: visible
    });
  }
  resolve(camList);
});

const getLocation = (id) => new Promise( async (resolve,reject) => {
  const locationRef = db.ref(`locations/${id}`);
  const locationSnapshot = await locationRef.once('value');
  if(!locationSnapshot.val()){
    return reject('location doesnt exist');
  }
  const locationObj = locationSnapshot.val();
  console.log('locationObj',locationObj);
  resolve(locationObj);
});

const updateLocation = (id,obj) => new Promise( async (resolve,reject) => {
  const locationRef = db.ref(`locations/${id}`);
  const locationUpdate = await locationRef.update(obj);
  console.log('locationUpdate',locationUpdate);
  resolve(locationUpdate);
});

const updateLocationVis = ( id, value ) => new Promise( async (resolve,reject) => {
  const locationRef = db.ref(`locations/${id}`);
  const locationUpdate = await locationRef.update({visible: value});
  console.log('locationUpdate',locationUpdate);
  resolve(locationUpdate);
});

const createLocation = (id,obj) => new Promise( async (resolve,reject) => {
  const locationRef = db.ref(`locations/${id}`);
  const initProp = {default: '', cams:{}}
  const initObj = {...initProp, ...obj}
  const locationCreate = await locationRef.set(initObj);
  resolve(locationCreate);
});

const createCam = (locationId,camId) => new Promise( async (resolve,reject) => {
  const camRef = db.ref(`locations/${locationId}/cams/${camId}`);
  const camCreate = await camRef.set('dir');
  resolve(camCreate);
});

const checkLocation = (id) => new Promise( async (resolve,reject) => {
  const locationRef = db.ref(`locations/${id}`);
  const locationSnapshot = await locationRef.once('value');
  const checkResult = locationSnapshot.exists()
  resolve(checkResult);
});

const checkCam = (id) => new Promise( async (resolve,reject) => {
  const locationsRef = db.ref(`locations`);
  const locationsSnapshot = await locationsRef.once('value');
  const locationsObj = locationsSnapshot.val();
  console.log('locationsObj',locationsObj);
  let checkResult = false;
  for (const locationKey in locationsObj) {
    for (const camKey in locationsObj[locationKey].cams) {
      if (camKey == id) checkResult = true;
    }
  }
  resolve(checkResult);
});

export {
  getLocations,
  getLocation,
  updateLocation,
  updateLocationVis,
  createLocation,
  createCam,
  checkLocation,
  checkCam
};
