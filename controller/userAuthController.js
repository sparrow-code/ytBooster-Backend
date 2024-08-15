import AccountModel from "../model/accountModel.js";

const getAcount = async (req, res) => {
  // Get All Cookie From Database
  try {
    const account = await AccountModel.find();

    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAccountById = async (req, res, next) => {
  try {
    const account = await AccountModel.findById(req.params.id);

    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const postAccount = async (req, res, next) => {
  // To Post Cookie And Store Data into Database
  try {
    const account = await AccountModel.create(req.body);

    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const putAccountById = async (req, res, next) => {
  try {
    const account = await AccountModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteAccountByID = async (req, res, next) => {
  try {
    const account = await AccountModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  getAcount,
  getAccountById,
  postAccount,
  putAccountById,
  deleteAccountByID,
};
