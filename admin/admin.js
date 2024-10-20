const express = require('express')
const mongoose = require('mongoose')
require('../collections/message')
const Mensagem = mongoose.model('Mensagem')
const router = express.Router()
//Main router
router.get('/', (req, res, next) => {
    res.render('index')
})
//Send message
router.post('/sendmessage', (req, res, next) => {
    //Catch sessionId
    const sessionId = req.sessionID
    //Construct database informations
    const message = {
        Name: req.body.nomeuser,
        Email: req.body.emailuser,
        Message: req.body.messageuser,
        Session: sessionId
    }
    //Find session in database
    Mensagem.findOne({ Session: sessionId }).then((data) => {
        function startFunc() {
            if (req.session.timeMessage > 0) {
                req.session.timeMessage = req.session.timeMessage - 1
                req.session.save((err) => {
                    if (err) {
                        console.log('Erro ao salvar a sessão: ' + err)
                    }
                    else{
                        console.log(req.session.timeMessage)
                    }
                })
            }
            else{
                clearInterval(req.session.playFunc)
                req.session.regenerate((err) => {
                    if (err) {
                        console.log('Erro ao reiniciar o ID')
                    }
                    else{
                        console.log('ID reiniciado com sucesso.')
                    }
                })
                console.log('Sessão reiniciada com sucesso!')
            }
        }
        //If session is null in database, create a new information
        if (data == null) {
            //If name is null, default a name = 'Empty Name'
            if (message.Name == null || message.Name == '') {
                message.Name = 'Empty Name'
            }
            //Save in database
            new Mensagem(message).save()
                .then(() => {
                    console.log('Nova mensagem salva.')
                    //Create 20 seconds to send ohter message to session
                    //Send to frontEnd message
                    res.status(200).send({ message: 'Message sent successfully!' })
                    req.session.timeMessage = 20
                    req.session.playFunc = setInterval(startFunc, 1000)
                })
                //If any field is null, send a errorMessage to FrontEnd
                .catch((err) => {
                    const localError = Object.keys(err.errors)[0]
                    res.status(400).send({ message: `The field ${localError} is empty.` })
                })
        }
        //If session in database is notNull, this user already sent a message. So send message to FrontEnd. Need wait
        else {
            res.status(400).send({
                message: `You have already sent a message.<br/>
                Wait ${req.session.timeMessage}s.`
            })
        }
    })
})
module.exports = router