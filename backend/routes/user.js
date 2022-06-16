// import d'express et mise en place du router
const express = require('express');
const router = express.Router();

// import du controller utilisateur
const userCtrl = require('../controllers/user');

// import middleware password 
const password = require('../middleware/password');

// mise en place des routes
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

// export du router
module.exports = router;