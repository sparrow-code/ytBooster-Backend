// TODO : CRUD Operation For Service

// Import Dependencies
import express from "express";

// Import Controller
import {
  getService,
  getServiceByName,
  postService,
  putService,
  deleteService,
  getServiceById,
} from "../controller/serviceController.js";
import { checkDashAuth } from "../middleware/checkAuth.js";

// Import Middleware

const router = express.Router();

router.route("/").get(getService).post(postService);

router
  .route("/id/:id")
  .get(getServiceById)
  .put(checkDashAuth(["Admin"]), putService) // ! Use by Dashboard
  .delete(deleteService);

// ! By Android User
router.route("/:serviceName").get(getServiceByName);

export default router;
