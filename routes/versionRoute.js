import express from "express";
import fs from "fs";
import siteData from "../config/siteData.json" assert { type: "json" };
const router = express.Router();

router.get("/", (req, res) => {
  console.log(siteData);
  res.json({ status: "success", version: siteData.appVersion });
});

router.post("/", (req, res) => {
  const appVersion = req.body.appVersion;

  fs.writeFileSync("./config/siteData.json", JSON.stringify({ appVersion }));

  res.json({ status: "success", version: appVersion });
});

export default router;
