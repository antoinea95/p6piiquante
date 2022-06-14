const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// création de l'objet utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

// mise en place du plugin pour que l'email soit unique
userSchema.plugin(uniqueValidator);

// export de l'objet utilisateur
module.exports = mongoose.model('user', userSchema);