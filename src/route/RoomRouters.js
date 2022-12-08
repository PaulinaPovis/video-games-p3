const { Router } = require('express');
const { userController } = require('../controller/UserController');
const { roomController } = require('../controller/RoomController');
const router = Router();

    router.get('/rooms', roomController.getAllRooms);
    router.get('/rooms/:id',roomController.getRoomById);
    router.post('/rooms', roomController.createRoom);
    router.post('/rooms/:id/users', roomController.addUserOnRoom);
    router.post('/rooms/:id/delete-user', roomController.deleteUserOnRoom);

    module.exports = router;