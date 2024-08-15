import mongoose from "mongoose";
import "dotenv/config";

let DB_URL =
  process.env.MONGO_DB ||
  `mongodb+srv://saiUser:MIZC9HT067f8TE7S@cluster0.okysuip.mongodb.net/ytBooster`;

const connectDatabase = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // createIndexes: true, // Use createIndexes option instead of useCreateIndex
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.error("db error >>>", error.message);
    });
};

export default connectDatabase;
