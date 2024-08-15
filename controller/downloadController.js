import snapSave from "../utils/snapSave.js";
import saveIg from "../utils/saveIg.js";
import saveFree from "../utils/saveFree.js";

export const downloadVideo = async (req, res, next) => {
  try {
    let response = {},
      result = {
        photo: [],
        video: [{ thumbnail: "", url: "" }],
      };

    const url = req.body.url;

    response = await saveIg(url);

    if (response.error == true) {
      response = await saveFree(url);
    }

    if (response.error === true) {
      response = await snapSave(url);
    }

    if (response.error === true) {
      res.status(200).json({
        status: false,
        error: "The link you have entered is invalid. ",
      });
    } else {
      res.status(200).json({ status: true, response: response });
    }

    // ! Erorr Handling
  } catch (err) {
    res.status(200).json({
      status: false,
      error: err.message,
    });
  }
};
