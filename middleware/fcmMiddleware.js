// Firebase Middleware where we will send notification to user

import "dotenv/config";

// ! Firebase Admin SDK
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import notificationModel from "../model/notificationModel.js";
import InstagramModel from "../model/InstagramModel.js";

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  projectId: "growinsta-68d95",
});

const subscribeTopic = async (tokenArray) => {
  try {
    const response = await getMessaging().subscribeToTopic(
      tokenArray,
      "allUsers"
    );

    return true;
  } catch (error) {
    console.log(
      "🚀 ~ file: fcmMiddleware.js:40 ~ subscribeTopic ~ error:",
      error
    );
    return false;
  }
};

async function sendNotification(JobName) {
  // We should Fetch Message And Url By Using Job Name
  const notify = await notificationModel.findOne({ jobName: JobName });

  const getToken = await InstagramModel.find().select("fcmToken");
  let tokenArray = getToken.map((doc) => doc.fcmToken);
  tokenArray = [...new Set(tokenArray)];

  const message = {
    /* data: {
      title: notify.title,
      body: notify.details,
    },*/
    notification: {
      title: notify.title,
      body: notify.details,
    },
    android: {
      notification: {
        channelId: "in.growinsta",
        priority: "high",
        visibility: "public",
        sound: "notify",
        // sound: "notify",
      },
    },
    // token: tokenArray,
    topic: "allUsers",
  };

  getMessaging()
    .send(message)
    .then(async (response) => {
      // * When Message Send Successfully
      await notificationModel.findOneAndUpdate(
        { jobName: JobName },
        { status: "Send" }
      );
    })
    .catch((error) => {
      // * When Message Send Failed
      console.log("Error sending message:", error);
    });
}

export { subscribeTopic, sendNotification };
