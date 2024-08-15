import InstagramModel from "../model/InstagramModel.js";

import { subscribeTopic } from "../middleware/fcmMiddleware.js";
import { queryByTime } from "../utils/timeFrame.js";

const getInstagram = async (req, res, next) => {
  try {
    var user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    if (req.query.option !== "All") {
      const dateQuery = queryByTime(req.query);
      user = await InstagramModel.find({ updatedAt: dateQuery }).sort({
        updatedAt: -1,
      });
    } else {
      user = await InstagramModel.find()
        .sort({
          updatedAt: -1,
        })
        .limit(100)
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

const getAllPostAndMedia = async (req, res) => {
  try {
    const { max_id, result } = req.postUrl;
    res.status(200).json({ status: true, result: result, max_id: max_id });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getInstagramByUserName = async (req, res, next) => {
  // Get Instagram By Id From Database
  try {
    const user = await InstagramModel.findOne({
      usrName: req.params.userName,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const postInstagram = async (req, res, next) => {
  const { instaID, profilePic, usrName, fullName, follower, following, post } =
    req.usrData;

  // TODO : Check if User Name Already Exist Then Send Exist Data

  let user = await InstagramModel.findOne({
    $or: [{ instaID: req.usrData.instaID }, { usrName: req.params.userName }],
  });

  if (req.body.fcmToken != null) {
    subscribeTopic([req.body.fcmToken]);
  }

  if (user == null) {
    user = await InstagramModel.create({
      instaID,
      profilePic,
      usrName,
      fullName,
      follower,
      following,
      post,
      fcmToken: req.body.fcmToken,
    });
  } else {
    user = await InstagramModel.findOneAndUpdate(
      { usrName: req.params.userName },
      {
        $set: {
          profilePic,
          fullName,
          follower,
          following,
          post,
          fcmToken: req.body.fcmToken,
        },
      },
      { new: true, runValidators: true } // Return the updated document
    );
  }

  res.status(200).json({ success: true, user });
};

const putInstagram = async (req, res, next) => {
  // To Update Instagram And Store Data into Database

  try {
    // Find and update the record based on instaID and usrName
    subscribeTopic([req.body.fcmToken]);

    const user = await InstagramModel.findOneAndUpdate(
      { usrName: req.params.userName },
      {
        $set: {
          profilePic: req.usrData.profilePic,
          fullName: req.usrData.fullName,
          follower: req.usrData.follower,
          number: req.body.number,
          following: req.usrData.following,
          post: req.usrData.post,
          fcmToken: req.body.fcmToken,
        },
      },
      { new: true, runValidators: true } // Return the updated document
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteInstagram = async (req, res, next) => {
  // To Delete Instagram From Database
  const user = await InstagramModel.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, user });
};

export {
  getInstagram,
  getInstagramByUserName,
  getAllPostAndMedia,
  postInstagram,
  putInstagram,
  deleteInstagram,
};
