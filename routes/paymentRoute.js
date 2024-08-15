import express from "express";

import {
  deletePaymentById,
  getPayment,
  getPaymentByRandom,
  postPayment,
  putPayment,
} from "../controller/paymentController.js";

// import { isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

router.route("/").get(getPayment).post(postPayment);

router.route("/:id").put(putPayment).delete(deletePaymentById);

// ! Access By Android User
router.route("/random").get(getPaymentByRandom);

export default router;
