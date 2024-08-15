// notification middleware where we will create a job and schedule a task and return a name

/* 
@params 
*/

import schedule from "node-schedule";

/* 
! import Task
? To Send Message To User
* it is Kind a Call Back
*/
import { sendNotification } from "./fcmMiddleware.js";
import notificationModel from "../model/notificationModel.js";


const setJob = (req, res, next) => {
  // get current timestamp
  const jobName = Date.now().toString(); // As A job Name
  const datetime = req.body.time;

  const cronJob = schedule.scheduleJob(jobName, datetime, function (jobName) {
    sendNotification(jobName);
  }.bind(this, jobName));

  req.body.jobName = jobName;

  next();
};

const updateJobByName = async (req, res, next) => {
  // get current timestamp
  const jobName = Date.now().toString(); // Updated job Name

  const notify = await notificationModel.findById(req.params.id);

  schedule.cancelJob(notify.jobName);

  const datetime = req.body.time;

  schedule.scheduleJob(jobName, datetime, sendNotification(jobName));

  next();
};


export { setJob, updateJobByName };
