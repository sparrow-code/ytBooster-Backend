import express from "express";

import {
  getDiscount,
  postDiscount,
  putDiscount,
  deleteDiscount,
} from "../controller/discountController.js";

const router = express.Router();

router
  .route("/")
  .get(getDiscount) // ? Call By Andrid User
  .post(postDiscount)
  .put(putDiscount)
  .delete(deleteDiscount);

export default router;
