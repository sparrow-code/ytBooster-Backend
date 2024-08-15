import express from "express";

import {
  deleteProxyById,
  getProxy,
  getProxyById,
  postProxy,
  putProxy,
} from "../controller/proxyController.js";
import { checkDashAuth } from "../middleware/checkAuth.js";

// import { isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

// DONE : Route of Proxy To Get | Add | Update | Delete
router
  .route("/")
  .get(checkDashAuth(["Admin"]), getProxy)
  .post(checkDashAuth(["Admin"]), postProxy);

router
  .route("/:id")
  .get(getProxyById)
  .put(checkDashAuth(["Admin"]), putProxy)
  .delete(checkDashAuth(["Admin"]), deleteProxyById);
export default router;
