import express from "express";

import {
  getAcount,
  getAccountById,
  postAccount,
  putAccountById,
  deleteAccountByID,
} from "../controller/userAuthController.js";

const router = express.Router();

router.route("/").get(getAcount).post(postAccount);

router.route("/:id")
.get(getAccountById)
.put(putAccountById)
.delete(deleteAccountByID);

export default router;
