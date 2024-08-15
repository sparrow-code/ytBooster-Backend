import express from "express";

import {
  loginUser,
  logout,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth";

const router = express.Router();

/**
    * * Only Admin Will Be Able To Login 
    * In That Case User Will Be LogOut
    * ? I Have Doubt
    * ! Doubt Gone
    * TODO : Let Do It
**/

router.route("/login").post(loginUser);


router.route("/logout").get( isAuthenticatedUser , logout);

// To Get User Detail
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// To Update The Password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// To Update Profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;