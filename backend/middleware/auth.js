// import de jwt pour l'échange de token
const jwt = require('jsonwebtoken');

// export de la fonction qui permet d'authentifié les requête utilisateur
module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        req.token = jwt.verify(token, `${process.env.TOKEN_SECRET_KEY}`);

        if(req.body.userId && req.body.userId !== req.token.userId) {
            throw 'UserId non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({error: error | 'Unauthorized request'});
    }
};