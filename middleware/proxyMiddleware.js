// import Module
import axios from "axios";

import fs from "fs";
import { formatNumber } from "../utils/formetNumber.js";

import dotenv from "dotenv";
dotenv.config();

const parseData = async (req, res, next) => {
  try {
    const { userName } = req.params;
    let usrData = {
      instaID: null,
      profilePic: null,
      usrName: null,
      fullName: null,
      follower: null,
      following: null,
      post: null,
    };

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
      `${process.env.IG_SCRAP_API}/api/v1/scrapeProfile`,
      { userName: userName }
    );
    const response = await fetchProfile.data;
    // ! if invalid username
    if (response.success === false) {
      res.status(200).json({ status: false, message: response.message });
      return;
    }

    let data = response?.data?.data?.user;

    // ! If User is Private
    if (data?.is_private === true) {
      res.status(200).json({ status: false, message: "Private Account" });
      return;
    }

    // ? If User is Public
    if (data?.is_private === false) {
      usrData.instaID = data?.id;
      usrData.usrName = data?.username;
      usrData.fullName = data?.full_name;
      usrData.follower = formatNumber(data?.edge_followed_by?.count);
      usrData.following = formatNumber(data?.edge_follow?.count);
      usrData.post = formatNumber(data?.edge_owner_to_timeline_media?.count);

      // Download Profile Pic
      await axios
        .get(data?.profile_pic_url, {
          responseType: "stream",
        })
        .then((response) => {
          response?.data?.pipe(
            fs.createWriteStream(`asset/img/profile/${usrData.usrName}.png`)
          );
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
        });

      usrData.profilePic = `/api/img/profile/${usrData.usrName}.png`;

      req.usrData = usrData;

      next();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const parseAllData = async (req, res, next) => {
  try {
    console.log("Parse All Data");
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
    console.error(error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export { parseData, parseAllData };
