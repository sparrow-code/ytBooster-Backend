import mongoose from "mongoose";
import noticeModel from "../model/noticeModel.js";

export const getNotices = async (req, res) => {
  try {
    const notices = await noticeModel.find();
    res.status(200).json(notices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTopNotice = async (req, res) => {
  const { version } = req.query;
  try {
    let notices;
    if (version) {
      notices = await noticeModel.findOne({ version: { $gt: version } });
      res.status(200).json({ success: true, notice: notices });
    } else {
      notices = await noticeModel.find();
      res.status(200).json({ success: true, notice: notices[0] });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createNotice = async (req, res) => {
  const notice = req.body;
  const newNotice = new noticeModel(notice);
  try {
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  const { id: _id } = req.params;
  const notice = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Notice with that id");
  const updatedNotice = await noticeModel.findByIdAndUpdate(
    _id,
    { ...notice, _id },
    {
      new: true,
    }
  );
  res.json(updatedNotice);
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Notice with that id");
  await noticeModel.findByIdAndRemove(id);
  res.json({ message: "Notice deleted successfully." });
};
