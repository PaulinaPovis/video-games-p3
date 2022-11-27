const { Router } = require('express');
const { gameController } = require('../controller/GameController');
const router = Router();

    router.get('/games', gameController.getAllGames);
    router.post('/games', gameController.createGame);
    router.post('/games/:idgame/players', gameController.addPlayerOnGame);

    router.get('/games/:idgame',gameController.getGameById);
    router.put('/games/:idgame/cells/:idcell',gameController.updateCellByIdFromGameById);
    router.get('/games/:idgame/cells/:idcell',gameController.getCellByIdFromGameById);
    

    module.exports = router;