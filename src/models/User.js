const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

//campos de un usuario
const UserSchema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}//fecha de creacion del user

})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); //generar HASH
    const hash = bcrypt.hash(password, salt);
    return hash; //devuelve contraseña cifrada
};

//Cuando el usuario inicie sesión...
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password); //comparamos si la contraseña y la cifrada es 
    //la misma, para ello, la contraseña introducida se cifra, y se compara con la de la bd (que 
    //ya esta cifrada)
};

module.exports = mongoose.model('User', UserSchema);