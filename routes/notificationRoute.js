import express from "express";

import {
  getNotification,
  getActiveNotification,
  postNotification,
  putNotification,
  deleteNotification,
} from "../controller/notificationController.js";

import { setJob, updateJobByName } from "../middleware/jobMiddleware.js";

import { getData } from "../middleware/parseData.js";
import { checkDashAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(getNotification) // ? Call By Andrid User

  /*
   * 1. get All User
   * 2. Create A Task Schedule with function
   *    --- send notification to all user
   * Get The Job Name
   * Store The Job Name in Database
   */
  .post(checkDashAuth(["Admin"]), getData, setJob, postNotification); // Here i have to use Middle Ware

router
  .route("/:id")

  /*
   * Get Notification By Id
   * Get Notification Job Name and Cancle it
   * Create A new Job with new data
   * Update the data into database
   */
  .put(updateJobByName, putNotification)

  /*
   * get notiifcation by id
   * get notification job name and cancle that job
   * update the data into database
   */
  .delete(checkDashAuth(["Admin"]), deleteNotification);

router.route("/active").get(getActiveNotification);

export default router;
