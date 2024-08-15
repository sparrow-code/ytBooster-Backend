import express from "express";
import {
  getNotices,
  getTopNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controller/noticeController.js";

const router = express.Router();

router.route("/").get(getNotices).post(createNotice);

router.route("/top").get(getTopNotice); // ! Call By Android User

router.route("/:id").put(updateNotice).delete(deleteNotice);

export default router;
