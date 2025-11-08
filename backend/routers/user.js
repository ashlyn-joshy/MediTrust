const express = require('express');
const router = express.Router();

//controllers
const userController = require('../controllers/user');

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.delete("/deleteUser/:userId", userController.deleteUser);

module.exports = router;