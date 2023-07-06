const express = require('express');
const path = require ('path');
const exphbs = require('express-handlebars');
const _handlebars = require('handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const Training = require('./models/Training');
var fs = require('fs');
var crypto = require('crypto');

// INICIALIZACIONES
const app = express();
require('./database');
require('./config/passport');

// SETTINGS -> Configuraciones
app.set('port', process.env.PORT || 3000); //definimos el puerto, si existe uno que lo tome y sino que use el 3000
app.set('views', path.join(__dirname, 'views')); // join -> concatena carpetas. Localizamos carpeta views, que es donde irán los HTMLs
app.engine('.hbs', exphbs({ //.hbs para que sean archivos handlebars
    //propiedades para saber usar las vistas:
     defaultLayout: 'main', //navegación que se repetirá en todas las vistas
     layoutsDir: path.join(app.get('views'), 'layouts'), 
     partialsDir: path.join(app.get('views'), 'partials') ,
     extname:'.hbs' //extension de los archivos
 }));
 app.set('view engine', '.hbs'); //utilizar la configuración / motor de las vistas 


// MIDDLEWARES -> Funciones ejecutadas antes de llegar al servidor
app.use(express.urlencoded({extended: false})); //para recibir datos del usuario (email,contraseña)
app.use(methodOverride('_method')); //para que los formularios pueden usar otros metodos ademas de GET y POST 
app.use(session({ //para autenticar el usuario
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// VARIABLES GLOBALES -> Colocar ciertos datos accesibles por toda la aplicacion
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Middleware de autenticación personalizado
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // Redirigir al usuario no autenticado a la página de inicio de sesión
    res.redirect('/signin');
  };

//SUBIDAS DE ARCHIVOS con MULTER

//const storage = multer.diskStorage({
//    destination: 'src/public/uploads/',
//    filename: function(req, file, cb){
        /*console.log("multer", req.user.date)
        myDate = req.user.date.replace("-", "")
        myDate = myDate.replace(":", "")
        console.log("mydate", myDate)*/
//        cb("",req.user.email + file.originalname + req.date);
//    }
// })


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var { date } = req.body
        const { email } = req.user
        date = date.replace("/", "")
        date = date.replace("/", "")

    const path = `src/public/uploads/${email}/${date}`
    fs.mkdirSync(path, { recursive: true })
    return cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
});

//////////////////////////////////////////////////GESTION DEL FORMULARIO_ENTRENO/////////////////////////////////////////:

//Todo: 
app.post("/training", ensureAuthenticated, upload.array('file', 12), async function(req,res, next){
    const {
        date, 
        hours, 
        energy_level, 
        mood, 
        mood_after, 
        concentration, 
        concentration_after
    } = req.body;
    
    const errors = [];
    if(!date){
        errors.push({text: 'Inserte la fecha en el formulario'});
    }

    if(errors.length > 0){
        res.render('/formulario_entreno', {errors});
    }
    else{
/*
        if(!mood_after){
            mood_after = null;
        }

        if(!concentration_after){
            concentration_after = null;
        }
*/
        const addTraining = new Training({
            hours, 
            energy_level, 
            mood, 
            mood_after, 
            concentration, 
            concentration_after
        });

        if(req.files){
            for(let i = 0; i < req.files.length; i++){
                let concat = '';
                if(i===0) concat = '_before_empatica'
                if(i===1) concat = '_before_muse'
                if(i===2) concat = '_after_empatica'
                if(i===3) concat = '_after_muse'
               
                req.files[i].originalname = req.files[i].originalname.replace(".csv", "")
                req.files[i].originalname += concat + '.csv'
                
                addTraining.file[i] = req.files[i];
            }
        }
        
        if(date){
            const dateArray = date.split("/");

            year = String(dateArray[2]); 
            month = String(dateArray[1]);
            day = String(dateArray[0]); 

            addTraining.formatDate = day + '/' + month + '/' + year;
            addTraining.date = year + month + day;
        }

        addTraining.email = req.user.email
        
        await addTraining.save();

        const query = { email:  req.user.email };
        
        const allTrainings = await Training.find(query).sort({'date': -1}).lean(); //para ordenar

        res.render('panel', {folder: allTrainings});
    }

});

// RUTAS -> urls
app.use(require('./routes/index'));
app.use(require('./routes/users'));


// ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname, 'public')));


// INICIAR SERVIDOR 

app.listen(app.get('port'), () => {
    console.log('El servidor esta escuchando en el puerto', app.get('port')) //LEYENDO PUERTO
});
