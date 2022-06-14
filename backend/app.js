// création d'un app express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');



//import router
const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce');

// init mongoose
mongoose.connect('mongodb+srv://antoinea95:2638691995Aa_@cluster0.guou6yl.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

/* Headers permettent d'accéder à l'API depuis n'importe quelle orgine, d'ajouter les headers mentionnées 
et de formuler les requêtes avec les méthodes mentionnées */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());

// mise en place des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);


// export de l'app
module.exports = app;