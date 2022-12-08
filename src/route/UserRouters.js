const { Router } = require('express');
const { userController } = require('../controller/UserController');
const { roomController } = require('../controller/RoomController');
const router = Router();

    router.get('/users', userController.getAllUsers);
    router.get('/users/:id',userController.getUserById);
    router.post('/users', userController.createUser);
    router.delete('/users',userController.deleteUser);
    router.post('/login',userController.login);

    // Socket.io
    io.on('connection', (socket) => {console.log('user connected')});
    socket.on('disconnect', () => {console.log('user disconnected');});
   
    module.exports = router;