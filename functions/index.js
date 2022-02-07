const functions = require('firebase-functions');
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.checkForFood = functions.storage.object().onFinalize(async (object) => {
  
  // 1. Cloud Vision API.
  const visionClient = new vision.ImageAnnotatorClient();
  const [result] = await visionClient.labelDetection(
    `gs://${object.bucket}/${object.name}`
  );

  // 2. Extract the highest classification
  const label = result.labelAnnotations[0].description
  const score = result.labelAnnotations[0].score

  // 3. Generate the downloadable URL's
  const file = admin.storage().bucket().file(`${object.name}`)
  const signedURLs = await file.getSignedUrl({action: 'read', expires: new Date(2023, 0)})

  // 4. Store Data information
  const docRef = db.collection('food').doc(object.name);
  await docRef.set({
    label,
    score,
    url: `gs://${object.bucket}/${object.name}`,
    download: signedURLs[0]
  });
});
