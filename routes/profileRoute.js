/**
 * ? API To Get User Profile From Instagra
 * ? And Store Profile Data into Database
 **/

import { parseData, parseAllData } from "../middleware/v1.parser.middleware.js";

import {
  getInstagram,
  getInstagramByUserName,
  postInstagram,
  putInstagram,
  deleteInstagram,
  getAllPostAndMedia,
} from "../controller/isntaController.js";

import { createExportFile } from "../utils/xlsx.js";

import { checkAuth, checkDashAuth } from "../middleware/checkAuth.js";

import express from "express";
import {
  parseAllDataV2,
  parseProfileV2,
} from "../middleware/v2.parser.middleware.js";

const router = express.Router();

router.route("/").get(checkDashAuth(["Admin"]), getInstagram); // ! Used in Dashboard

router
  .route("/:userName")
  .get(getInstagramByUserName) // ? Call By Andrid User
  .post(parseProfileV2, postInstagram) // ? Call By Andrid User
  .put(parseProfileV2, putInstagram); // ? Call By Andrid User

router.route("/:id").delete(checkAuth, deleteInstagram);

// ? By Android User
router
  .route("/all/:userName")
  .get(checkAuth, parseAllDataV2, getAllPostAndMedia);

router.route("/user/export").get().post(createExportFile);

export default router;
