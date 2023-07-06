//urls de la aplicacion principal

const router = require('express').Router(); //facilita la creacion de routers.
const Training = require('../models/Training');


router.get('/', (req,res) => {
    //res.send('Index');
    res.render('index');
});

router.get('/about', (req,res) => {
    //res.send('About');
    res.render('about');
});

router.get('/panel', async function(req,res) {
    //res.send('About');
    
    const query = { email:  req.user.email  };

    const folder = await Training.find(query).sort({'date': -1}).lean();;
    res.render('panel', {folder:folder});
   
});

router.get('/formulario_entreno', (req,res) => {
    //res.send('Formulario');

    res.render('formulario_entreno', {user:req.user});
});

router.get('/formulario_descanso', (req,res) => {
    //res.send('Formulario');
    res.render('formulario_descanso', {user:req.user});
});

router.get('/deleteTraining', async function(req,res) {
    const folder = await Training.remove();
    res.render('panel', {folder:folder});
});

/*
//ANTES DE 'ULTIMOS CAMBIOS':
router.get('/analisis', async function(req,res) {
    res.render('analisis');
});
*/

router.get('/analisis/:query', async function (req,res) {
    const {query} = req.params;
    const {date} = req.query;

    console.log('FECHA', date);
    console.log('QUERY', query);

    const folder = await Training.find({date:date, email: query}); // TODO: filtrar por email
    // const file_before_muse = await Training.find({date:date});
    // const file_after_muse = await Training.find({date:date});
    console.log('FOLDER', folder);

    res.render('analisis', {folder:folder});
    
});



module.exports = router;

