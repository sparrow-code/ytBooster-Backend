// import Module
import axios from "axios";

import fs from "fs";
import { formatNumber } from "../utils/formetNumber.js";

import dotenv from "dotenv";
dotenv.config();

const parseData = async (req, res, next) => {
  try {
    const { userName } = req.params;
    console.log("V1 User Name >>> ", userName);

    const checkForLogin = await axios.get(
      `${process.env.IG_SCRAP_API}/api/v1/loginInsta`
    );

    if (
      checkForLogin.data.success === true &&
      checkForLogin.data.cookie != {}
    ) {
      // Handle the case when the user is logged in
    }

    const response = await axios.post(
      `${process.env.IG_SCRAP_API}/api/v1/scrapeProfile`,
      {
        userName,
      }
    );

    if (
      !response.data.success ||
      response.data.data.message === "checkpoint_required"
    )
      return next();

    const data = response.data.data.data.user;

    if (data?.is_private) {
      return res
        .status(200)
        .json({ status: false, message: "Private Account" });
    }

    const usrData = {
      instaID: data?.id,
      usrName: data?.username,
      fullName: data?.full_name,
      follower: formatNumber(data?.edge_followed_by?.count),
      following: formatNumber(data?.edge_follow?.count),
      post: formatNumber(data?.edge_owner_to_timeline_media?.count),
      profilePic: `/api/img/profile/${data?.username}.png`,
    };

    await axios
      .get(data?.profile_pic_url, { responseType: "stream" })
      .then((response) =>
        response?.data?.pipe(
          fs.createWriteStream(`asset/img/profile/${usrData.usrName}.png`)
        )
      )
      .catch(console.error);

    req.usrData = usrData;
    next();
  } catch (error) {
    console.error("V1 Profile >> ", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const parseAllData = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const { count, maxId } = req.query;

    const checkForLogin = await axios.get(
      `${process.env.IG_SCRAP_API}/api/v1/loginInsta`
    );

    // ? What should i have to do if user is login
    if (
      checkForLogin.data.success === true &&
      checkForLogin.data.cookie != {}
    ) {
    }

    const fetchProfile = await axios.post(
      `${process.env.IG_SCRAP_API}/api/v1/scrapePostMedia`,
      { userName: userName, count: count, maxId: maxId }
    );
    const response = await fetchProfile.data;

    if (!response.success || response.data.message === "checkpoint_required")
      return next();

    let parseData = response.data;

    // Process the data
    let result = [];

    for (let item of parseData.items) {
      let image640x640 = item.image_versions2.candidates.filter(
        (candidate) => candidate.width === 640 && candidate.height === 640
      );

      if (image640x640.length > 0) {
        result.push({
          code: item.code,
          url: image640x640[0].url,
        });
      }
    }

    req.postUrl = { max_id: parseData.next_max_id, result };
    next();
  } catch (error) {
    console.error("Error V1 >> ", error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export { parseData, parseAllData };
