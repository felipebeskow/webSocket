var express = require('express');
var path = require('path');

//Criar sever http e socket
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//permitir o acesso ao front-end
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//definido rota http para o front
app.get('/', function(req, res, next) {
    res.render('index.html');
  });

let messages = [];

//abre conexão entre cliente e servidor
io.on('connection', socket=>{
    console.log(`Socket conectado: ${socket.id}`);
    
    //tras mensagens antigas
    socket.emit('previousMessages', messages);

    //recebe novas mensagens
    socket.on('sendMessage', data=>{
        messages.push(data);
        //envia para todos os clientes
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);
