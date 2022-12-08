const { Router } = require('express');
const { userController } = require('../controller/UserController');
const { roomController } = require('../controller/RoomController');
const router = Router();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

    router.get('/rooms', roomController.getAllRooms);
    router.get('/rooms/:id',roomController.getRoomById);
    router.post('/rooms', roomController.createRoom);
    router.post('/rooms/:id/users', roomController.addUserOnRoom);
    router.post('/rooms/:id/delete-user', roomController.deleteUserOnRoom);

    // Socket.io
    io.on('connection', (socket) => {console.log('user connected')});
    socket.on('disconnect', () => {console.log('user disconnected');});

    module.exports = router;