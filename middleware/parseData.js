import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";

import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const getData = (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err.message);
      res.status(400).json({ error: "Failed to parse form data" });
      return;
    }

    try {
      if (!files.image || !files.image[0].filepath) {
        req.body = {
          title: fields.title[0],
          details: fields.details[0],
          time: fields.time[0],
          jobName: "",
          status: fields.status[0],
        };
        next();
      } else {
        const tempFilePath = files.image[0].filepath;
        const uniqueFilename = `${uuidv4().substring(0, 8)}_${
          files.image[0].originalFilename
        }`;
        const destinationDir = path.join(__dirname, "asset/img/notification");

        // Create the destination directory if it doesn't exist
        if (!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir, { recursive: true });
        }

        const destinationPath = path.join(destinationDir, uniqueFilename);

        fs.copyFileSync(tempFilePath, destinationPath);

        const imagePath = `/api/img/notification/${uniqueFilename}`;

        req.body = {
          title: fields.title[0],
          details: fields.details[0],
          image: imagePath,
          time: fields.time[0],
          jobName: "",
          status: fields.status[0],
        };

        next();
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: "Failed to post notification" });
    }
  });
};

export { getData };
