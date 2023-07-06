//urls donde el user se tiene que autenticar

const router = require('express').Router(); //facilita la creacion de routers.
const User = require('../models/User'); //modelo de datos
const passport = require('passport');

router.get('/users/signin', (req, res) => { //para que el usuario pueda iniciar sesion
    //res.send('Ingresando en la app');
    res.render('users/signin.hbs');
});

//VISTA /USERS/SIGNIN
router.post('/users/signin', passport.authenticate('local', {
    //en caso de que todos los datos del usuario estén correctos, redireccionamos
    //hacia la subida de datos.
    successRedirect: '/panel',

    //en caso de que haya error, redireccionamos a que vuelva a registrarse
    failureRedirect: '/users/signin',
    failureFlash:  true
}));

//VISTA /USERS/SIGNUP
router.get('/users/signup', (req, res) => { //para que el usuario pueda iniciar sesion
    //res.send('Formulario de autenticacion');
    res.render('users/signup.hbs');
});

router.post('/users/signup', async (req, res) => {

    const {name, lastname, email, password, password2} = req.body;
    const errors = [];

   if(name.length <= 0){
        errors.push({text: 'Insertar nombre'});
    }

    if(password != password2){
        errors.push({text: 'Las contraseñas no coinciden'});
    }

    if(password.length < 4){
        errors.push({text: 'La contraseña deberia ser más larga'});
    }

    if(errors.length > 0){
        res.render('users/signup', {errors, name, lastname, email, password, password2})

    } else{
        const emailUser = await User.findOne({email: email});
        
        //vamos a asegurarnos de que no se creen dos cuentas con el mismo email
        if(emailUser){
            req.flash('error_msg', 'El email ya existe');
            res.redirect('/users/signup');

        }
    
        const newUser = new User({name, lastname, email, password});
        //reemplazamos la contraseña del usuario por la contraseña de usuario cifrada:
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Está registrado');
        res.redirect('/users/signin'); //redireccionamos a login
   
    }
   
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;