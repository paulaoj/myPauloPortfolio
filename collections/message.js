const mongoose = require('mongoose')
const Schema = mongoose.Schema

const message = new Schema({
    Name: {
        type: String,
    },
    Email:{
        type: String,
        required: true,
    },
    Message: {
        type: String,
        required: true,
    },
    Session: {
        type: String,
        required: true
    }
})

mongoose.model('Mensagem', message)