// Incorporación de: HTTP, Express, MiddleWares, Body Parser, Socket.io
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// MiddleWares
app.use(morgan('tiny'));
app.use(cors());

// Lectura y Parseo de los Body
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use( express.static('public'));

// Routers
app.use('/api',require('./src/route/UserRouters'));
app.use('/api',require('./src/route/RoomRouters'));
app.use('/api',require('./src/route/GameRouters'));
app.get('/', (req,res) => {res.sendFile(__dirname + './src/route/UserRouters')});
app.get('/', (req,res) => {res.sendFile(__dirname + './src/route/RoomRouters')});
app.get('/', (req,res) => {res.sendFile(__dirname + './src/route/GameRouters')});

// Arranque Servidores
app.listen(3000,()=>{console.log("Server Port 3000")});
server.listen(3000, ()=>{console.log("Server Port 3000 (Socket.io)")});

// Socket.io
let players = [];
io.on('connection', (socket) => {
    console.log('user connected');
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
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});