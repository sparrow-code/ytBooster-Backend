import "dotenv/config";
// import InstagramModel from '../models/instagramModel.js';
import jwt from "jsonwebtoken";
// ! Data of Instagram User
import InstagramModel from "../model/InstagramModel.js";
// ! Data of Dashboard User
import UserModel from "../model/UserModel.js";

const checkAuth = async (req, res, next) => {
  try {
    /* console.log("checkAuth.js req.body >> ", req.body);
    console.log("checkAuth.js req.params >> ", req.params); */

    // FCM Token
    const fcmToken = req.headers.authorization.split(" ")[1]; // Bearer <token>
    // console.log("checkAuth.js FCM Token >> ", fcmToken);

    if (!fcmToken) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    const account = await InstagramModel.findOne({
      usrName: req.params.userName || req.body.userName,
      fcmToken: fcmToken,
    });

    req.account = account;
    // console.log("checkAuth.js req.account >>", req.account);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

const checkDashAuth = (roles) => {
  try {
    return async (req, res, next) => {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>

      if (!token) {
        return res.status(200).json({
          message: "Auth failed",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = (req.user = await UserModel.findOne({
        userName: decoded.userName,
      }));

      if (!user) {
        return res.status(200).json({
          message: "Auth failed",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      next();
    };
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
export { checkAuth, checkDashAuth };
