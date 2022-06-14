// import d'express et mise en place du router
const express = require('express');
const router = express.Router();

// import du controller utilisateur
const userCtrl = require('../controllers/user');

// mise en place des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// export du router
module.exports = router;