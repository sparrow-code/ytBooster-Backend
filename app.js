import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

import connectDatabase from "./config/db.js";

// Import Route Handler
import routeProfile from "./routes/profileRoute.js";
import routeProxy from "./routes/proxyRoute.js";
import routeSmm from "./routes/smmRoute.js";
import routeService from "./routes/serviceRoute.js";
import routeDownload from "./routes/downloadRoute.js";
import routeLogin from "./routes/loginRoute.js";
import routeOrder from "./routes/orderRoute.js";
import routePayment from "./routes/paymentRoute.js";
import routeNotification from "./routes/notificationRoute.js";
import routeDiscount from "./routes/discountRoute.js";
import routeAccount from "./routes/accountRoute.js";
import routeSalesOrder from "./routes/salesOrderRoute.js";
import routeNotice from "./routes/noticeRoute.js";
import routeVersion from "./routes/versionRoute.js";
import routeYoutube from "./routes/youtubeRoute.js";

const app = express();

connectDatabase();

// Reveal All File
app.use("/api", express.static("asset"));
app.use(cors());

// Pre-Define Middle Ware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/v1/smm", routeSmm); // CRUD For SMM Lite's Service
// DONE : Add Route For Parse And Store Insta Profile
app.use("/api/v1/profile", routeProfile);
app.use("/api/v1/order", routeOrder); // CRUD For Order
app.use("/api/v1/proxy", routeProxy); // ? CRUD For Smart Proxy
app.use("/api/v1/service", routeService); // CRUD For Service
app.use("/api/v1/login", routeLogin);
app.use("/api/v1/payment", routePayment);
app.use("/api/v1/notification", routeNotification);
app.use("/api/v1/discount", routeDiscount);
app.use("/api/v1/download", routeDownload); // For Download Instagram Reels | Video | Photo
app.use("/api/v1/notice", routeNotice);
app.use("/api/v1/appVersion", routeVersion);

app.use("/api/v1/instaAccount", routeAccount); // For Cookie
app.use("/api/v1/youtube", routeYoutube);

// API For Normal DashBoard
app.use("/api/v1/salesOrder", routeSalesOrder);

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
