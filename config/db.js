if(process.env.NODE_ENV == "production"){
 module.exports = {mongoURI: 'mongodb+srv://paulosilvajunior2004:ifdVOmCvw0ILraLZ@database.oebx0.mongodb.net/?retryWrites=true&w=majority&appName=dataBase  '}
}
else{
module.exports = {mongoURI: 'mongodb://localhost/mydatabase'}
}