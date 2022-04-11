const UserController = require('../controller/UserController')
const express = require('express')
const router = express.Router();

router.get('/login', UserController.login);
router.get('/register', UserController.register);
router.post('/login', UserController.loginPost);
router.post('/register', UserController.registerPost);
router.get('/logout', UserController.logout);

module.exports = router;