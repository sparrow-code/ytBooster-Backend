import axios from "axios";
import fs from "fs";
import { formatNumber } from "../utils/formetNumber.js";

import dotenv from "dotenv";
dotenv.config();

const fetchData = async (method, url, data) => {
  try {
    console.log(data);
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    return { status: false, message: err.message };
  }
};

export const parseProfileV2 = async (req, res, next) => {
  try {
    if (req.usrData && Object.keys(req.usrData).length > 0) return next();

    const { userName } = req.params;

    let response,
      endpoint = ["storiesig", "pixwox"];

    for (let i = 0; i < endpoint.length; i++) {
      response = await fetchData(
        "post",
        `${process.env.IG_SCRAP_API}/api/v2/profile`,
        {
          host: endpoint[i],
          userName,
        }
      );
      if (response.status) {
        console.log("Profile >> " + endpoint[i] + " >> Is Working");
        break;
      } else {
        console.error("Profile >> " + endpoint[i] + " >> Is Not Working");
      }
    }

    // console.log("After Loop User Profile V2 >>> ", response.data.result);

    if (!response.data.result || !response.data.result.user) return next();

    const data = response.data.result.user;

    if (data?.is_private) {
      return res
        .status(200)
        .json({ status: false, message: "Private Account" });
    }

    const usrData = {
      instaID: data?.strong_id__,
      usrName: data?.username,
      fullName: data?.full_name,
      follower: formatNumber(data?.follower_count),
      following: formatNumber(data?.following_count),
      post: formatNumber(data?.media_count),
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
  } catch (err) {
    console.error("Profile V2 Error >>> ", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

export const parseAllDataV2 = async (req, res, next) => {
  try {
    if (
      req.postUrl &&
      req.postUrl.result &&
      Object.keys(req.postUrl.result).length > 0
    )
      return next();
    console.log("Post And Media Version 2");

    const { userName } = req.params;
    const { count, maxId } = req.query;
    const { instaID } = req.account;

    /*
    const payload = {
      userName,
      next_id: maxId,
      user_id: instaID,
    };
    const { data: response } = await axios.post(
      `${process.env.IG_SCRAP_API}/api/v2/posts`,
      maxId ? payload : { userName }
    ); */

    let response,
      endpoint = ["blastup", "pixwox"];

    for (let i = 1; i < endpoint.length; i++) {
      response = await fetchData(
        "post",
        `${process.env.IG_SCRAP_API}/api/v2/posts`,
        {
          userName: userName,
          host: endpoint[i],
          user_id: instaID ? instaID : null,
          count: 12,
          next_id: maxId ? maxId : null,
        }
      );
      // console.log(endpoint[i] + "Loop User Post And Media V2 >>> ", response);
      if (response.status) {
        console.log("Post >> " + endpoint[i] + " >> Is Working");
        break;
      } else {
        console.error("Post >> " + endpoint[i] + " >> Is Not Working");
      }
    }

    let max_id = response.data.next || response.data.maxid;
    let posts = [];

    if (response.data.posts && response.data.posts.length > 0) {
      posts = response.data.posts.map(({ id, thumbnail }) => ({
        code: id,
        url: thumbnail,
      }));
    } else if (response.data.items && response.data.items.length > 0) {
      posts = response.data.items.map(({ thum }) => ({ url: thum }));
    }

    console.log(response.data.items);

    req.postUrl = {
      max_id,
      result: posts,
    };

    next();
  } catch (err) {
    console.error("Error V2 >>> ", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
