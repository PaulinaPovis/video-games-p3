const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


//MiddleWares
app.use(morgan('tiny'));
app.use(cors());

// lectura y parseo de los body
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use( express.static('public'));




const server = app.listen(3000,()=>{console.log("Servidor arrancado en el puerto 3000")});


// routers
app.use('/api',require('./src/route/UserRouters'));
app.use('/api',require('./src/route/RoomRouters'));
app.use('/api',require('./src/route/GameRouters'));



//Socket IO
let players = [];

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected server.js');

    socket.on('game:player-1', (player) => {
        players.push(player);
        console.log(players);
        io.sockets.emit('game:player-1', players);
    });

    socket.on('game:player-2', (player) => {
        players.push(player);
        console.log(players);
        io.sockets.emit('game:players', players);
    });

    socket.on('game:delete-player', (player) => {
        const playerIndex = players.findIndex(item => item.id == player.id);
        players.splice(playerIndex, 1);
        const data = {
            players: players,
            index: playerIndex
        };
        io.sockets.emit('game:players-update', data);
    });

    socket.on('game:cell-selected', (data) => {
        io.sockets.emit('game:cell-selected', data);
    });

});