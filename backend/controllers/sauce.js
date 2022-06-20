// import des models et du module file system
const Sauce = require('../models/sauce');
const fs = require('fs');


// controller pour créer la sauce (post)
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: "sauce créée!"}))
        .catch(error => res.status(400).json({error}));
};

// controller pour afficher toutes les sauces (get)
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

// controller pour afficher une seule sauce (get)
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

// controller pour modifier la sauce (post)
exports.modifySauce = (req, res) => {

    // si la requête contient alors on supprime l'image
    if(req.file) {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/resized/')[1];
            fs.unlink(`images/resized/${filename}`, (err) => {
                if(err) {
                    throw err;
                }
            });
        })
        .catch(error => res.status(500).json({error}))
    }

    // si la requête contien un fichier on récupère l'objet sauce qu'on parse et on modifie l'url de l'image
    const sauceObject = req.file ?
    {   
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized/${req.file.filename}`
    }: {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
}


// controller pour supprimer une sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/resized/')[1];
            fs.unlink(`images/resized/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce delete'}))
                .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}))
};

// controller pour liker une sauce
exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const userId = req.body.userId;
            const like = req.body.like;

            // renvoie true si le tableau contient l'userId
            const likeId = sauce.usersLiked.includes(userId);
            const dislikeId = sauce.usersDisliked.includes(userId);

            // switch qui vérifie si la condition est true
            switch(true) {

                case like !== 0 && dislikeId || like !== 0 && likeId:
                return res.status(403).json({error: 'Non autorisé'});
                break;

                case like===1 && likeId === false:
                Sauce.updateOne({_id: req.params.id}, {$inc:{likes: +1}, $push:{usersLiked:userId}})
                .then(() => res.status(200).json({message: "Like envoyé"}))
                .catch(error => res.status(400).json({error}));
                break;

                case like === -1 && dislikeId === false:
                Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes: +1}, $push:{usersDisliked:userId}})
                .then(() => res.status(200).json({message: "Dislike envoyé"}))
                .catch(error => res.status(400).json({error}));
                break;

                case like === 0 && likeId:
                Sauce.updateOne({_id: req.params.id}, {$inc:{likes: -1}, $pull:{usersLiked:userId}})
                .then(() => res.status(200).json({message: "Like annulé"}))
                .catch(error => res.status(400).json(console.log(error)));
                break;

                case like === 0 && dislikeId:
                Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes: -1}, $pull:{usersDisliked:userId}})
                .then(() => res.status(200).json({message: "Dislike annulé"}))
                .catch(error => res.status(400).json(console.log(error)));
                break;

                case like !== 0 && dislikeId:
                return res.status(403).json({error: 'Non autorisé'});
                break;
            }
        })
        .catch(error => res.status(400).json({error}));
};