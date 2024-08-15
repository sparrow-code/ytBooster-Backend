import express from "express";
import axios from "axios";
import "dotenv/config";

const router = express.Router();

router.route("/channel").post(async (req, res) => {
  const { link } = req.body;
  try {
    const response = await axios.post(
      process.env.YOUTUBE_SCRAP_API + "/channelDetail",
      {
        url: link,
      }
    );

    res.send({ status: "success", data: response.data });
  } catch (err) {
    console.log("Channel Error >>>", err.message);
    res.send({ status: "error", error: err.message });
  }
});

router.route("/video").post(async (req, res) => {
  const { link } = req.body;
  try {
    const response = await axios.post(
      process.env.YOUTUBE_SCRAP_API + "/thumbnail",
      {
        url: link,
      }
    );

    res.send({ status: "success", data: response.data });
  } catch (err) {
    console.log("Channel Error >>>", err.message);
    res.send({ status: "error", error: err.message });
  }
});

export default router;
