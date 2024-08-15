// ? task : create and export xlsx file

import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

import InstagramModel from "../model/InstagramModel.js";

const createExportFile = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const data = await InstagramModel.find().lean();
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    const filePath = path.join(__dirname, "../asset", "profile.xlsx");
    xlsx.writeFile(wb, filePath);
    res.status(200).json({ success: true, message: "File Created" });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: true, message: error.message });
  }
};

export { createExportFile };
