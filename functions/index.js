const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const vision = require('@google-cloud/vision');
const db = admin.firestore();

exports.checkForFood = functions.storage.object().onFinalize(async (object) => {
  
  // 1. Cloud Vision API.
  const visionClient = new vision.ImageAnnotatorClient();
  const [result] = await visionClient.labelDetection(
    `gs://${object.bucket}/${object.name}`
  );

  // 2. Extract the highest classification
  let label = result.labelAnnotations[0].description
  let score = result.labelAnnotations[0].score

  // 2. Store Data information
  const docRef = db.collection('food').doc(object.name);
  await docRef.set({
    label,
    score,
    url: `gs://${object.bucket}/${object.name}` 
  });
});
