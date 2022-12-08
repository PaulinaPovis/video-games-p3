const  {roomData} = require('../data/RoomData');
const { request, response } = require('express');
class RoomController {


    getAllRooms(req,res=response){
            res.status(200);
            res.json(roomData.rooms);
    }

    getRoomById(req=request,res=response){
      
            const {id} = req.params;
            console.log('id '+id);
            const room = roomData.rooms.find(u => u.id == id);
            console.log('room'+ room);
            res.status(200);
            res.json(room);
      

    }


    createRoom(req=request,res=response){
  
        const room =  req.body;
          // obtener un id randon 
        room.id=Math.floor(Math.random() * 1000000) + 10;

        roomData.rooms.push(room);
        res.status(200);
        res.json(roomData.rooms);
        
    }

    addUserOnRoom(req=request,res=response){
       
        const user =  req.body;
        const {id} = req.params;


        var isAddUser = false;

        const selectedRoom = roomData.rooms.find(item => item.id == Number(id));
        console.log(selectedRoom);

        roomData.rooms.forEach(room => {
            if(room.players.some(item => item.id === Number(user.id))){
                isAddUser = true;
            }
        });

        if(selectedRoom.players.length < 2 && !isAddUser){
           selectedRoom.players.push(user);
           res.status(200);
           res.json(roomData.rooms);
        } else if(selectedRoom.players.length === 2){
            res.status(400);
            res.json({mssg: "The room is full! Please choose another room!"});
        } else{
            res.status(400);
            res.json({mssg: "You are already in a room, please exit the room!"});
        }
    
    }

    deleteUserOnRoom(req=request,res=response){
        const user =  req.body;
        const {id} = req.params;
        console.log('idRoom delete ', id);
        roomData.rooms.forEach(r =>{
        if(u => u.id == id){
        const plays = r.players.filter(f  => f.id !=user.id);
            r.players = plays;  
        }
        });
  
        res.status(200);
        res.json(roomData.rooms);
    }
    
}

const roomController = new RoomController();
module.exports ={roomController};