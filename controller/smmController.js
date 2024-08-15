// TODO :  CRUD SMM API List
import axios from "axios";
import SmmApiModel from "../model/SmmApiModel.js";

export const getSMM = async (req, res) => {
  try {
    let data = await SmmApiModel.find();
    res.status(200).send({ success: true, smm: data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllOrderStatusById = async (req, res) => {
  try {
    const smmData = await SmmApiModel.findOne({
      name: req.body.apiName,
      status: "Active",
    });

    const payload = {
      key: smmData.apiKEY,
      action: "status",
      orders: req.body.orders.join(","),
    };
    const smmOrdersDetail = await axios.post(smmData.smmURL, payload, {
      Headers: { "Content-Type": "application/json" },
    });

    res.status(200).json({ success: true, smm: smmOrdersDetail.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const postSMM = async (req, res) => {
  try {
    let data = await SmmApiModel.create(req.body);
    res.send({ success: true, data: data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const putByID = async (req, res) => {
  try {
    let data = await SmmApiModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // res.send( { success : true }, data );
    res.send({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getByID = async (req, res) => {
  try {
    let data = await SmmApiModel.findById(req.params.id);
    res.send({ success: true, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// 648f8ffa72712c004be4470a

export const deleteByID = async (req, res) => {
  try {
    let data = await SmmApiModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, smm: data });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/*
{
    "key": "6618b57230b0aac6352137c6728a091e",
    "action" : "add",	// add
    "service" : 4738,	// Service ID
    "link" : "http://localhost:3001/api/v1/smm/callback",	// Link to page
    "quantity" : 50,	// Needed quantity
    "runs" : 2,	// Runs to deliver
    "interval"  : 5 // (optional)	Interval in minutes
}
*/
