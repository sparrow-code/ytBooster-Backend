import express from "express";

import { downloadVideo } from "../controller/downloadController.js";

const router = express.Router();

router.route("/").get((req, res) => {
  res.send({ status: "Inactive" });
}).post(downloadVideo);

export default router;
