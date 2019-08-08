const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema ({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    cidade: {
        type: String,
        required: true
    }

})

mongoose.model('usuarios', Usuario)