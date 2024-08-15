/*
 * Write Controller for service
 * And Send Response Back
 */

// TODO : CRUD Operation For Service

import ServiceModel from "../model/ServiceModel.js";

// 648fb728d184fd2d490bfc87

const getService = async (req, res, next) => {
  const service = await ServiceModel.find();
  /* 
  ! short by service.parentService
    ! then short by service.price
  */

  res.status(200).json({ success: true, service });
};

const getServiceById = async (req, res) => {
  // Get Service By Id From Database
  const service = await ServiceModel.findById(req.params.id);

  res.status(200).json({ success: true, service });
};

const getServiceByName = async (req, res, next) => {
  // Get Service By Id From Database
  const service = await ServiceModel.find({
    parentService: req.params.serviceName,
    status: "Active",
  });

  service.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  res.status(200).json({ success: true, service });
};

const postService = async (req, res, next) => {
  // To Post Service And Store Data into Database
  const service = await ServiceModel.create(req.body);

  res.status(200).json({ success: true, service });
};

const putService = async (req, res, next) => {
  try {
    console.log(req.body);
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    Object.assign(service, req.body);

    await service.save();

    res.status(200).json({ success: true, service });
  } catch (err) {
    console.log(err.message);
    res.status(200).json({ success: false, message: err.message });
  }
};

const deleteService = async (req, res, next) => {
  // Delete Service From Database
  const service = await ServiceModel.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, service });
};

export {
  getService,
  getServiceByName,
  getServiceById,
  postService,
  putService,
  deleteService,
};
