import OrderModel from "../model/OrderModel.js";
import ServiceModel from "../model/ServiceModel.js";
import SmmApiModel from "../model/SmmApiModel.js";

const verifyService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await ServiceModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.quantity != req.body.quantity.toString()) {
      return res.status(404).json({ message: "Service quantity not matched" });
    }

    if (service.price != req.body.amount.toString()) {
      return res.status(404).json({ message: "Service amount not matched" });
    }

    req.service = service;
    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const service = await ServiceModel.findById(order.serviceID);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { verifyService, getServiceById };
