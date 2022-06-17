const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// recadre les images dans la largeur pour conserver une présentation similaire
module.exports = async (req, res, next) => {
    const {filename: image} = req.file;

    await sharp(req.file.path)
    .resize(500, null)
    .toFile(path.resolve(req.file.destination, 'resized', image))
    fs.unlink(req.file.path, (err) => {
        if(err) {
            throw err;
        }
    });

    next();
}