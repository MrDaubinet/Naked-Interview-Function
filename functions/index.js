const functions = require('firebase-functions');

const fbConfig = {
  projectId: "your-firebase-project-id",
  keyfileName: 'keyfile.json'
};

const vision = require('@google-cloud/vision')(fbConfig);

const admin = require("firebase-admin");
const serviceAccount = require("./keyfile.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "gs://naked-insurance-interview.appspot.com"
});

// Sep 0 -> Create a Firebase DB to store our image data
const db = admin.database();
const imageRef = db.ref('classifications');
// let userRef;

exports.callVision = functions.storage.object().onArchive(event => {
  //  Step 1 -> get classification
  const obj = event.data;
  console.log(obj)
  // gs://naked-insurance-interview.appspot.com
  // const gcsUrl = "gs://naked-insurance-interview.appspot.com/" + obj.name;
  const gcsUrl = "gs://" + obj.bucket + "/" + obj.name;
  console.log("gcsUrl:"+ gcsUrl)
  functions.logger.log("gcsUrl:"+ gcsUrl);
  const userId = obj.name.substring(0, obj.name.indexOf('/'));
  console.log("userId:"+ userId)
  functions.logger.log("userId:"+ userId);
  userRef = db.ref('users').child(userId);
  // console.log("gcsUrl:"+ gcsUrl)

  return Promise.resolve()
    .then(() => {
      let visionReq = {
          "image": {
              "source": {
                  "imageUri": gcsUrl
              }
          },
          "features": [
              {
                  "type": "LABEL_DETECTION"
              },
              // Other detection types here...
          ]
      }
      return vision.annotate(visionReq);
    })
    .then(([visionData]) => {
      //  Step 2 -> update storage details
      console.log(visionData)
      functions.logger.log(visionData);
      // let imgMetadata = visionData[0];
      console.log('got vision data: ', visionData[0]);
      functions.logger.log('got vision data: ', visionData[0]);
      // imageRef.push(imgMetadata);
      return 
    })
    .then(() => {
      console.log(`Parsed vision annotation and wrote to Firebase`);
      functions.logger.log(`Parsed vision annotation and wrote to Firebase`);
    });
});