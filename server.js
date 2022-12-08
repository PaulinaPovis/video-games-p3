const http = require('http');
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const gameJson = require("./gamesJson.json");




//MiddleWares
app.use(morgan('tiny'));
app.use(cors());

// lectura y parseo de los body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use( express.static('public'));




// const server = app.listen(3000,()=>{console.log("Servidor arrancado en el puerto 3000")});
httpServer.listen(3000);


// routers
app.use('/api',require('./src/route/UserRouters'));
app.use('/api',require('./src/route/RoomRouters'));
app.use('/api',require('./src/route/GameRouters'));

io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    console.log(gameJson)
    //Room 1
    socket.on('game::start-1', (args) => {
        console.log(args)
        const data = {
            gamePLayers: args,
            json: gameJson
        }
        io.sockets.emit('game::start-1', (data))
    });

    socket.on('game::set-cell-1', (args) => {
        const currentJsonGame = gameJson.games.find(game => game.id == args.gameId);
        const data = {
            gamePlayercurrentPlayer: args.currentPlayer,
            cellNumber: args.cellNumber,
            json: currentJsonGame
        };
        io.sockets.emit('game::set-cell-1', (data))
    });

    //Room 2
    socket.on('game::start-2', (args) => {
        console.log(args)
        const data = {
            gamePLayers: args,
            json: gameJson
        }
        io.sockets.emit('game::start-2', (data))
    });

    socket.on('game::set-cell-2', (args) => {
        const currentJsonGame = gameJson.games.find(game => game.id == args.gameId);
        const data = {
            gamePlayercurrentPlayer: args.currentPlayer,
            cellNumber: args.cellNumber,
            json: currentJsonGame
        };
        io.sockets.emit('game::set-cell-2', (data))
    });

    //Room 3
    socket.on('game::start-3', (args) => {
        console.log(args)
        const data = {
            gamePLayers: args,
            json: gameJson
        }
        io.sockets.emit('game::start-3', (data))
    });

    socket.on('game::set-cell-3', (args) => {
        const currentJsonGame = gameJson.games.find(game => game.id == args.gameId);
        const data = {
            gamePlayercurrentPlayer: args.currentPlayer,
            cellNumber: args.cellNumber,
            json: currentJsonGame
        };
        io.sockets.emit('game::set-cell-3', (data))
    });

    //Room 4
    socket.on('game::start-4', (args) => {
        console.log(args)
        const data = {
            gamePLayers: args,
            json: gameJson
        }
        io.sockets.emit('game::start-4', (data))
    });

    socket.on('game::set-cell-4', (args) => {
        const currentJsonGame = gameJson.games.find(game => game.id == args.gameId);
        const data = {
            gamePlayercurrentPlayer: args.currentPlayer,
            cellNumber: args.cellNumber,
            json: currentJsonGame
        };
        io.sockets.emit('game::set-cell-4', (data))
    });
});