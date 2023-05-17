const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

/* GET All Users */
router.get("/", user_controller.all_users_get);

/* GET User Signup */
router.get("/signup", user_controller.user_signup_get);

/* POST User Signup */
router.post("/signup", user_controller.user_signup_post);

/* GET User Login */
router.get("/login", user_controller.user_login_get);

/* POST User Login */
router.post("/login", user_controller.user_login_post);

/* POST User Logout */
router.post("/logout", user_controller.user_logout_post);

/* GET User Profile */
router.get("/:id", user_controller.user_profile_get);

/* GET User Edit Profile */
router.get("/:id/edit", user_controller.user_profile_edit_get);

/* PUT User Update */
router.put("/:id/", user_controller.user_profile_put);

module.exports = router;
