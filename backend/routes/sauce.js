// import d'express et mise en place du router
const express = require('express');
const router = express.Router();

// import des middlewares et d'auth + multer pour la gestion des images
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeimg = require('../middleware/resizeimg');

// import des controllers
const sauceCtrl = require('../controllers/sauce');

// mise en place des routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, resizeimg, sauceCtrl.createSauce);
router.put('/:id', auth, multer, resizeimg, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// export du router
module.exports = router;