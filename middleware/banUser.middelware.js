import BanUserModel from "../model/banUser.model.js";

const checkForBanUser = async (req, res, next) => {
  try {
    const checkBan = await BanUserModel.findOne({
      userName: `${req.account.usrName}`,
      instaId: `${req.account.instaID}`,
    });

    console.log("Check Ban >>> ", checkBan);

    if (checkBan) {
      return res.status(401).json({
        message: "You are banned",
      });
    }

    next();
  } catch (error) {
    console.log("Check Ban Error >>> ", error.message);
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

export { checkForBanUser };
