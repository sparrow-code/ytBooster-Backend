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
    const order = await OrderModel.findById(req.params.id);
    res.status(200).json({ status: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ? To Generate Order For User User Will Make Payment After This
const generateOrder = async (req, res) => {
  try {
    const maxOrderId = await OrderModel.find().sort({ orderId: -1 }).limit(1);

    if (maxOrderId.length === 0) {
      req.body.orderId = 1;
    } else {
      req.body.orderId = maxOrderId[0].orderId + 1;
    }

    // Order Created
    const order = await OrderModel.create({
      userName: req.body.userName,
      posts: req.body.posts,
      quantity: req.body.quantity,
      serviceID: req.body.serviceID,
      orderId: req.body.orderId,
      amount: req.body.amount,
      status: "Processing",
    });

    res.status(200).json({ status: true, order: order });
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

const failedOrder = async (req, res) => {
  try {
    console.log(req.params.orderId);
    const order = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      {
        status: "Failed",
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

const postOrder = async (req, res) => {
  try {
    // Order Created
    //  const order = await OrderModel.create(req.body);
    // res.status(200).json({ status: true, order: order });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
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
  failedOrder,
  createOrder,
  placeOrder,
  postOrder,
  putOrderById,
  deleteOrderByID,
};
