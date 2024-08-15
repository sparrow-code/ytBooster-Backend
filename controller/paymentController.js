import Gateway from "../model/GatewayModel.js";

const getPayment = async (req, res) => {
  try {
    let data = await Gateway.find();
    res.status(200).send({ success: true, gateway: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getPaymentByRandom = async (req, res) => {
  try {
    let data = await Gateway.aggregate([
      { $match: { status: "Active" } },
      { $sample: { size: 1 } },
    ]);
    res.status(200).send({ success: true, gateway: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const postPayment = async (req, res) => {
  try {
    let data = await Gateway.create(req.body);
    res.status(201).send({ success: true, gateway: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const putPayment = async (req, res) => {
  try {
    let data = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ success: true, gateway: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deletePaymentById = async (req, res) => {
  try {
    let data = await Gateway.findByIdAndDelete(req.params.id);
    res.status(200).send({ success: true, gateway: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export {
  getPayment,
  getPaymentByRandom,
  postPayment,
  putPayment,
  deletePaymentById,
};
