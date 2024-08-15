import express from "express";

import {
  verifyService,
  getServiceById,
} from "../middleware/serviceMiddleware.js";
import {
  getAllOrder,
  getOrderById,
  getOrderByUsername,
  getFilterOrder,
  createOrder,
  generateOrder,
  placeOrder,
  failedOrder,
  postOrder,
  putOrderById,
  deleteOrderByID,
} from "../controller/orderController.js";
import { filterOrder, makeOrderOnSmm } from "../middleware/orderMiddleware.js";

import { checkAuth, checkDashAuth } from "../middleware/checkAuth.js";

import { checkForBanUser } from "../middleware/banUser.middelware.js";

const router = express.Router();

// ! Below All Route Have Called By Admin
router
  .route("/")
  .get(checkDashAuth(["Admin"]), getAllOrder) // ? Call By Dashboard
  .post(filterOrder, getFilterOrder); // ? Call By Dashboard
// To Create An Order And Provide Service To User
router
  .route("/getOrderByUsername/:userName")
  .get(checkDashAuth(["Admin"]), getOrderByUsername); // ? Call By Dashboard

router
  .route("/:id")
  .get(getOrderById) // ? Call By Dashboard
  .put(putOrderById) // ? Call By Dashboard
  .delete(deleteOrderByID); // ? Call By Dashboard

// ! Below All Route Have Called By Android App
// ? Call By Android App
router
  .route("/generateOrder/:serviceId")
  .post(checkAuth, checkForBanUser, verifyService, generateOrder); // To Generate Order For User

// ? Call By Android App
router.route("/failedOrder/:orderId").put(checkAuth, failedOrder);

// ? Call By Android App
router
  .route("/placeOrder/:id")
  // ! Check Auth  , Get SMM Api,  Get Order Id's Service,  Make Order On SMM, Place Order
  .put(checkAuth, getServiceById, makeOrderOnSmm, placeOrder); // To Generate Order For User

export default router;
