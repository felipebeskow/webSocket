var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', indexRouter);

let messages = [];

io.on('connection', socket=>{
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data=>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);
