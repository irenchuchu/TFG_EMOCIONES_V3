const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require('../models/User');

//comprobación de los datos del usuario en la base de datos => AUTENTICACIÓN DE USUARIOS 
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {

    const user = await User.findOne({email: email});

    if(!user){ //cuando la persona se intenta autenticar sin un correo valido
        return done(null, false, { message: 'Usuario no encontrado.'}); //terminar proceso de autenticación: con un error, con ningun usuario, o con mensaje de error

    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user); //devolvemos el usuario, está todo correcto (null indica que NO hay error)
        }else{
            return done(null, false, { message: 'Contraseña incorrecta.'});
        }
    }
}));

//almacenamos en sesion el id del usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//proceso inverso
passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
});