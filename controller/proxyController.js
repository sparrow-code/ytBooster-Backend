import ProxyModel from "../model/ProxyModel.js";
import CacheStorage from "../utils/cacheStorage.js";

// DONE : CRUD Operations For Proxy
const getProxy = async (req, res, next) => {
  // Get All Proxy From Database
  try {
    const data = await ProxyModel.find();

    res.status(200).json({ success: true, proxy: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getProxyById = async (req, res, next) => {
  // Get Proxy By Id From Database
  const proxy = await ProxyModel.findById(req.params.id);

  res.status(200).json({ success: true, proxy });
};

// ? To Get Random Proxy From Database
const getRandomProxy = async (req, res, next) => {
  try {
    const proxy = await ProxyModel.aggregate([
      { $match: { status: "Active" } },
      { $sample: { size: 1 } },
    ]);

    const { userName, pswd, ip, port } = proxy[0];

    if (next) {
      // Store it in req.proxy
      req.proxy = `http://${userName}:${pswd}@${ip}:${port}`;
      next();
    }
    if (res) {
      res.status(200).json({ success: true, proxy: proxy[0] });
    }
    return `http://${userName}:${pswd}@${ip}:${port}`;
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};

const postProxy = async (req, res, next) => {
  // To Post Proxy And Store Data into Database
  const { userName, pswd, ip, port } = req.body;

  const user = await ProxyModel.create({
    userName,
    pswd,
    ip,
    port,
    status: req.body.status,
  });

  res.status(200).json({ success: true, user });
};

const putProxy = async (req, res, next) => {
  // To Update Proxy And Store Data into Database
  const { userName, pswd, ip, port, status } = req.body;

  const user = await ProxyModel.findByIdAndUpdate(
    req.params.id,
    {
      userName,
      pswd,
      ip,
      port,
      status,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({ success: true, user });
};

const deleteProxyById = async (req, res, next) => {
  try {
    const data = await ProxyModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, proxy: data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export {
  getProxy,
  getProxyById,
  getRandomProxy,
  postProxy,
  putProxy,
  deleteProxyById,
};
