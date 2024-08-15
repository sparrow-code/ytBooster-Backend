import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import UserModel from "../model/UserModel.js";
import { checkDashAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { userName, userPswd } = req.body;
  try {
    const user = await UserModel.findOne({ userName: userName });
    if (user) {
      if (
        user.userPswd === userPswd &&
        user.status === "Active" &&
        user.role === "Admin"
      ) {
        let token = jwt.sign(
          {
            userName: userName,
            status: user.status,
            role: user.role,
          },
          process.env.SECRET_KEY,
          { expiresIn: "24h" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          path: "/",
          maxAge: 1000 * 60 * 60 * 24,
        });

        res.send({ status: "success", token: token });
      } else {
        res.send({ status: "error", error: "Invalid Username or Password" });
      }
    } else {
      res.send({ status: "error", error: "Invalid Username or Password" });
    }
  } catch (err) {
    console.log("Login API POST Error >>>", err.message);
    res.send({ status: "error", error: err.message });
  }
});

router
  .route("/me")
  .get(checkDashAuth(["Admin"]), async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.send({ status: "error", error: "Invalid Token" });

      res.send({ status: "success", user });
    } catch (err) {
      console.log(err);
      res.send({ status: "error", error: err });
    }
  })
  .put(checkDashAuth(["Admin"]), async (req, res) => {
    try {
      console.log("req.body ", req.body);
      const user = req.user;
      if (!user) return res.send({ status: "error", error: "Invalid Token" });

      const { userPswd } = req.body;
      if (userPswd != null) {
        user.userPswd = userPswd;
        await user.save();
      }

      res.send({ status: "success", user });
    } catch (err) {
      console.log(err);
      res.send({ status: "error", error: err });
    }
  });

export default router;
