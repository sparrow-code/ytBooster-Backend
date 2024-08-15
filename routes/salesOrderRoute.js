import { checkDashAuth } from "../middleware/checkAuth.js";
import OrderModel from "../model/OrderModel.js";
import { queryByTime } from "../utils/timeFrame.js";
import InstagramModel from "../model/InstagramModel.js";

import express from "express";

const router = express.Router();

router.route("/").get(checkDashAuth(["Admin"]), async (req, res) => {
  try {
    var user, order;
    if (req.query.option !== "All") {
      const dateQuery = queryByTime(req.query);
      const [newUsers, updatedUsers] = await Promise.all([
        InstagramModel.find({ createdAt: dateQuery }).sort({ createdAt: -1 }),
        InstagramModel.find({ updatedAt: dateQuery }).sort({ updatedAt: -1 }),
      ]);

      user = {
        newUser: newUsers.length,
        openUser: updatedUsers.length,
      };

      order = await OrderModel.find({ updatedAt: dateQuery }).sort({
        createdAt: -1,
      });
    } else {
      const users = await InstagramModel.find().sort({
        updatedAt: -1,
      });
      user = {
        newUser: users.length,
        openUser: users.length,
      };
      order = await OrderModel.find()
        .populate("serviceID")
        .sort({ createdAt: -1 });
    }

    if (user && order) {
      res.status(200).json({
        success: true,
        user: user,
        order: {
          successOrder: order.filter((item) => item.status === "Success")
            .length,
          processingOrder: order.filter((item) => item.status === "Processing")
            .length,
          failedOrder: order.filter((item) => item.status === "Failed").length,
          totalOrder: order.length,
          successSales: order.reduce(
            (acc, item) =>
              item.status === "Success"
                ? parseInt(acc) + parseInt(item.amount)
                : parseInt(acc),
            0
          ),
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Failed To Get Data" });
    }
  } catch (error) {}
});

export default router;
