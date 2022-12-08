const { Router } = require('express');
const { gameController } = require('../controller/GameController');
const router = Router();
    // global.io.emit('news', { hello: 'world' });
    // global.io.on('connection', (socket) => {
    //     console.log('a user connected');
    // });

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

    
    

    module.exports = router;