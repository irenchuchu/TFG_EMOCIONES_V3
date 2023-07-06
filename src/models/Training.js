
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

//campos de un training
const TrainingSchema = new Schema({

    email: {type: String},
    formatDate: {type: String},
    date: {type: String, required: true},
    hours: {type: Number, required: true}, 
    energy_level: {type: Number, required: true}, 
    mood: {type: Number, required: true}, 
    mood_after: {type: Number}, 
    concentration: {type: Number, required: true}, 
    concentration_after: {type: Number},
    file: {type: Array, default: []}

   })

module.exports = mongoose.model('Training', TrainingSchema);
