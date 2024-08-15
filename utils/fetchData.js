// Fetch Data on Every 5 Minute Interval

import schedule from "node-schedule";
import axios from "axios";

async function fetchData() {
  const bearerToken =
    "fBgHRJ4kTb6DApXXYN-dBv:APA91bEmjGmipC8bGgRNsEEIGbmvtOx-UxzTLEVC3kU0zMDW4Ms0ektUHyHFFk1W2VzXAY3-kxk7wOg5XlmLcmfNc7jeZq533_7E0nD0oHp-ZcRNsJlZtTeGx25orb6HF7QAbg91b6up";
  const userName = ["sdworlld", "zeroxbit", "sam", "blurb", "nasa"];
  const randomIndex = Math.floor(Math.random() * userName.length);
  const selectRandomUser = userName[randomIndex];

  const profileFetch = await axios.post(
    `https://growinsta.in/api/v1/profile/${selectRandomUser}`,
    {
      fcmToken: bearerToken,
    }
  );

  console.log(profileFetch.data);

  const postFetch = await axios.get(
    `https://growinsta.in/api/v1/profile/all/${selectRandomUser}?count=12`,
    {
      headers: {
        Authorization: "Bearer " + bearerToken,
      },
    }
  );

  console.log(`Post Fetch on Every 5 Minute : ${postFetch.status}`);
}

export default async function fetchDataCron() {
  // Schedule a job that runs every day at the same minute and hour as now
  schedule.scheduleJob(`*/10 * * * *`, fetchData);
}
