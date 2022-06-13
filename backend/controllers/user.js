const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/user');


//inscription d'un utilisateur
exports.signup = (req ,res,next) => {

    // hash du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
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
exports.login = (req, res, next) => {
    // trouve le user dans la base de donnée
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(401).json({error: 'utilisateur non trouvé'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if(!valid) {
                        return res.status(401).json({error: 'mot de passe incorrect'})
                    }
                    return res.status(200).json({
                        UserId: user._id,
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