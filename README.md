# Firebase Function
## Description
The firebase function is a serverless api used to link the user images, an online classification and a mapping database. It has three responsibilites:
1. The function is triggered by a new image being added to a firebase storage bucket.
2. The function must send through the image to the Google Cloud Vision API for data annotation
3. The function must store the annotation with the images url and classification confidence. 

## Notes
This cloud function is linked to my gcp (google cloud platform) account. My gcp account has access to the Google Cloud Vision API and the usage billing of this API is done to my account. Therefore, this function will not work strait off the bat, unless you have access to the resources linked to this GCP project.

## What I learnt
What a cloud function is, how to write a cloud function, how to use cloud functions to integrate with other GCP services.

## What could be made better
1. The model I chose to use for data classification (Google Cloud Vision) annotates everthing it possibly can. However, my project specification required me only label various food items. Creating a model myself, or using a service which is specific to food, could be a benefit for my implementation.

2. The Code is pretty slow, a solution which batch processes the images could bring about some major improvements.