// import de bcrypt pour le hash et de jwt pour la gestion des échanges du token
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crytpoJs = require('crypto-js');

// import du ficher env
require('dotenv').config();


// import du model user
const User = require('../models/user');


//inscription d'un utilisateur
exports.signup = (req ,res) => {

    // cryptage de l'email dans la DB
    const emailCrypt = crytpoJs.HmacSHA256(req.body.email, `${process.env.EMAIL_KEY}`).toString();

    // hash du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: emailCrypt,
                password: hash
            });
            // sauvegarde de l'utilisateur
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur créé!'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};



// connexion d'un utilisateur
exports.login = (req, res) => {

    // cryptage de l'email dans la DB
    const emailCrypt = crytpoJs.HmacSHA256(req.body.email, `${process.env.EMAIL_KEY}`).toString();

    // trouve le user dans la base de donnée
    User.findOne({email: emailCrypt})
        .then(user => {
            if(!user) {
                return res.status(401).json({error: 'utilisateur non trouvé'})
            }
            // comparaison des hashs pour valider le mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if(!valid) {
                        return res.status(401).json({error: 'mot de passe incorrect'})
                    }
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            `${process.env.TOKEN_SECRET_KEY}`,
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};