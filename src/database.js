const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app', {
    //useCreateIndex: true,
    useNewUrlParser: true,
    //useFindAndModify: false
}) //(err) => {
    //console.log("Base de datos online ", err);
    .then(db => console.log('DB Conectada'))
    .catch(err => console.error(err));
//});