const express = require('express');
const router = express.Router();

//controllers
const userController = require('../controllers/user');

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;