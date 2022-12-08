const { Router } = require('express');
const { gameController } = require('../controller/GameController');
const router = Router();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

    router.get('/games', gameController.getAllGames);
    router.post('/games', gameController.createGame);
    router.post('/games/:idgame/players', gameController.addPlayerOnGame);

    //delete player from game
    router.delete('/games/:idgame/players/:idplayer', gameController.deletePlayerOnGame);

    // delete game
    router.get('/games/:idgame',gameController.getGameById);
    router.delete('/games/:idgame',gameController.deleteGameById);
    router.put('/games/:idgame/cells/:idcell',gameController.updateCellByIdFromGameById);
    router.get('/games/:idgame/cells/:idcell',gameController.getCellByIdFromGameById);

    // Socket.io
    io.on('connection', (socket) => {console.log('user connected')});
    socket.on('disconnect', () => {console.log('user disconnected');});
    
    module.exports = router;