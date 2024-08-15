import NotificationModel from "../model/notificationModel.js";
import moment from "moment";
import schedule from "node-schedule";

import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const getNotification = async (req, res) => {
  const { timestamp } = req.query;
  try {
    let data;
    if (timestamp && timestamp !== "") {
      data = await NotificationModel.find({
        status: "Send",
      }).sort({ _id: -1 });
    } else {
      data = await NotificationModel.find().sort({ _id: -1 });
    }
    res.status(200).json({ success: true, notification: data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const getActiveNotification = async (req, res) => {
  try {
    const data = await NotificationModel.find({ status: "Active" }).sort({
      _id: -1,
    });
    res.status(200).json({ success: true, notification: data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const postNotification = async (req, res) => {
  try {
    console.log(req.body);
    const data = await NotificationModel.create(req.body);

    res.status(200).json({ success: true, notification: data });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const putNotification = async (req, res) => {
  try {
    const data = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        details: req.body.details,
        jobName: req.jobName,
        time: req.time,
        status: req.body.status,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    res.status(200).json({ success: true, notification: data });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const data = await NotificationModel.findByIdAndDelete(req.params.id);

    // remove job by jobName
    schedule.cancelJob(data.jobName);

    if (data) {
      if (!data.image) {
        res.status(200).json({ success: true, notification: data });
        return;
      } else {
        const dataImagePath = data.image.replace("/api/", "/asset/");
        const imagePath = path.join(__dirname, dataImagePath);

        fs.unlinkSync(imagePath);
        res.status(200).json({ success: true, notification: data });
      }
    } else {
      res.status(200).json({ error: "Notification not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export {
  getNotification,
  getActiveNotification,
  postNotification,
  putNotification,
  deleteNotification,
};
