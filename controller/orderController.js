import OrderModel from "../model/OrderModel.js";
import { queryByTime } from "../utils/timeFrame.js";

// ? Use Only in DashBoard
const getAllOrder = async (req, res) => {
  try {
    var order;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    if (req.query.option !== "All") {
      const dateQuery = queryByTime(req.query);
      order = await OrderModel.find({ updatedAt: dateQuery })
        .populate("serviceID")
        .sort({ createdAt: -1 });
    } else {
      order = await OrderModel.find()
        .populate("serviceID")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({ success: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ! Use Only in DashBoard
const getOrderByUsername = async (req, res) => {
  try {
    var order;
    order = await OrderModel.find({
      userName: req.params.userName,
    })
      .populate("serviceID")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getFilterOrder = async (req, res) => {
  try {
    res.status(200).json({ status: true, order: req.order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "service_id"
    );
    res.status(200).json({ status: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ? To Generate Order For User, User Will Make Payment After This
const generateOrder = async (req, res) => {
  try {
    const maxOrderId = await OrderModel.find().sort({ order_id: -1 }).limit(1);

    if (maxOrderId.length === 0) {
      req.body.order_id = 1;
    } else {
      req.body.order_id = maxOrderId[0].order_id + 1;
    }

    // Order Created
    const order = await OrderModel.create({
      link: req.body.link,
      service_id: req.body.choosePlan,
      order_id: req.body.order_id,
      smm_order: "0",
      status: "Processing",
    });

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};

// ? To Place An Order Means User Has Paid For The Order
const placeOrder = async (req, res) => {
  try {
    res.status(200).json({ status: true, order: req.order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      {
        status: req.body.payment_status,
      },
      { new: true }
    );
    res.status(200).json({ status: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createOrder = async () => {
  // Get Random SSM API Key And Api Endpoint
  const getRandomApiKey = await SmmApiModel.aggregate([
    { $sample: { size: 1 } },
  ]);

  // Request While Create Order
  /* {
        "key" : "c761a7ac054df0e52e883b7af8052366",
        "action" : "add",
        "service" :	4859,
        "link" : "https://www.instagram.com/sdworlld/",
        "quantity" : 10
    } */

  // Response  While Get Order
  /* {
        "order": 172906270
    } */
};

const putOrderById = async (req, res) => {
  try {
    res.status(200).json("Pending");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteOrderByID = async (req, res) => {
  try {
    console.log(req.params.id);
    const order = await OrderModel.findByIdAndDelete(req.params.id);
    console.log(order);
    res.status(200).json({ status: true, order: order });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};

export {
  getAllOrder,
  getOrderById,
  getOrderByUsername,
  getFilterOrder,
  generateOrder,
  updateOrder,
  createOrder,
  placeOrder,
  putOrderById,
  deleteOrderByID,
};
