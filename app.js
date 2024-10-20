const bodyParser = require('body-parser')
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const router = require('./admin/admin')
const path = require('path')
const app = express()
const session = require('express-session')
const db = require('./config/db')
const cors = require('cors')
require("dotenv").config()

//Configurações
    app.use('/', express.static('/build'))
    //cors
    app.use(cors())
    //Session
    app.use(session({
        secret: 'randomkey',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: false,
            maxAge: 600000,
        }
      }))
    //bodyparser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        },
        layoutsDir: path.join(__dirname, 'views/layouts')
    }));
    app.set('view engine', 'handlebars');
    //mongoose
        mongoose.Promise = global.Promise
        
        mongoose.connect(db.mongoURI).then(() => {
            console.log('Conectado ao mongoose')
        }).catch((err) => {
            console.log('Houve um erro ao conectar-se ao mongoose: ' + err)
        })
    //public
        app.use(express.static(path.join(__dirname, 'public')))
    //rotas
    app.use(router)
//PORT
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log('Servidor Rodando')
})