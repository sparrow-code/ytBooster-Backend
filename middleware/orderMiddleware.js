import axios from "axios";
import OrderModel from "../model/OrderModel.js";
import moment from "moment/moment.js";
import SmmApiModel from "../model/SmmApiModel.js";

const filterOrder = async (req, res, next) => {
  try {
    /* 
    ! Status Action
    {
      "statusAction" : "success"
    }
    ! Coustom
    {
        "statusAction" : "success",
        "timeAction" : "custom",
        "startDate" : "2023-11-06T11:13:31.440Z",
        "endDate" : "2023-12-07T18:30:00.000Z"
    }
    */
    const { statusAction, timeAction, startDate, endDate } = req.body;
    const statusActions = ["pending", "failed", "processing", "success"];
    const timeActions = {
      today: {
        // past 24 hours
        $gte: moment().subtract(2, "days").toDate(),
        $lte: moment().startOf("day").toDate(),
      },
      week: {
        // past 7 days
        $gte: moment().subtract(7, "days").toDate(),
        $lte: moment().startOf("day").toDate(),
      },
      month: {
        // past 30 days
        $gte: moment().subtract(30, "days").toDate(),
        $lte: moment().startOf("day").toDate(),
      },
      year: {
        // past 365 days
        $gte: moment().subtract(365, "days").toDate(),
        $lte: moment().startOf("day").toDate(),
      },
      custom: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    let query = {};
    if (statusActions.includes(statusAction)) {
      query.status =
        statusAction.charAt(0).toUpperCase() + statusAction.slice(1);
    }
    if (timeActions[timeAction]) {
      query.createdAt =
        typeof timeActions[timeAction] === "object"
          ? timeActions[timeAction]
          : { $gte: timeActions[timeAction] };
    }

    if (
      Object.keys(query).length === 0 &&
      statusAction !== "all" &&
      timeAction !== "all"
    ) {
      return res.status(404).json({ message: "Invalid Action" });
    }

    req.order = await OrderModel.find(query).populate("serviceID");
    return next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ! Donn't Touch Below Code
// ? To Make Order on SMM Panel
const makeOrderOnSmm = async (req, res, next) => {
  try {
    if (
      req.body.approvalNo === undefined ||
      req.body.transactionId === undefined
    ) {
      return res.status(404).json({ message: "Invalid Data" });
    }

    var orderDetail = {};
    if (!req?.body?.version) {
      orderDetail = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
          approvalNo: req.body.approvalNo,
          transactionId: req.body.transactionId,
          status: "Lowest Version Check",
        },
        { new: true }
      );

      return res.status(200).json({ status: true, order: orderDetail });
    } else {
      orderDetail = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
          approvalNo: req.body.approvalNo,
          transactionId: req.body.transactionId,
          status: "Need Approval",
        },
        { new: true }
      );
    }
    next();
  } catch (error) {
    res.status(404).json({ status: false, message: error.message });
  }
};

const getAllDetailsOfOrder = async (req, res, next) => {
  const { apiName, serviceId, orderId } = req.body;
  try {
    let order = await OrderModel.findById(orderId).populate("serviceID");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const smmData = await SmmApiModel.findOne({
      name: order.serviceID.apiName,
    });

    const { quantity, posts } = order;

    // Roundup Quantity By Number of Post
    const baseQuantity = Math.floor(quantity / posts.length);
    const remainder = quantity % posts.length;

    const requests = posts.map((post, index) => {
      const link =
        order.serviceID.parentService === "follower"
          ? "https://instagram.com/" + post
          : "https://instagram.com/p/" + post;

      return axios.post(smmData.smmURL, {
        key: smmData.apiKEY,
        action: "add",
        service: order.serviceID.serviceID,
        link: link,
        quantity: baseQuantity + (index < remainder ? 1 : 0),
      });
    });

    const responses = await Promise.all(requests);

    const orderIds = responses.map((response) => response.data.order);
    order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        order: orderIds,
        status: "Success",
      },
      { new: true }
    );

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Error Place Order By Admin >> ", error.message);
    res.status(404).json({ message: error.message });
  }
};

export {
  filterOrder,
  getAllDetailsOfOrder,
  // Donn't Touch Below Code
  makeOrderOnSmm,
};
