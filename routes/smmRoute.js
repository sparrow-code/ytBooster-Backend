import express from "express";

import {
  getSMM,
  postSMM,
  getByID,
  putByID,
  deleteByID,
  getAllOrderStatusById,
} from "../controller/smmController.js";

import { getAllDetailsOfOrder } from "../middleware/orderMiddleware.js";

import { checkDashAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkDashAuth("Admin"), getSMM) // Used By Dashboard
  .post(postSMM);

router
  .route("/allOrderStatus")
  .post(checkDashAuth(["Admin"]), getAllOrderStatusById);

router.route("/placeOrder").post(getAllDetailsOfOrder); // ? By Dashboard

router
  .route("/:id")
  .get(getByID)
  .put(putByID)
  .delete(checkDashAuth(["Admin"]), deleteByID);

export default router;
