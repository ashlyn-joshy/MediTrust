const express = require('express');
const router = express.Router();

//controllers
const userController = require('../controllers/user');
//Authenticate
const requireAuth = require("../middleware/authMiddleware");

router.post("/createUser", requireAuth, userController.createUser);
router.post("/loginUser", userController.loginUser);
router.get("/getAllUsers", requireAuth, userController.getAllUsers);
router.delete("/deleteUser/:userId", requireAuth, userController.deleteUser);
router.put("/updateUser/:userId", requireAuth, userController.updateUser);

module.exports = router;