const  {userData} = require('../data/UserData');
const { request, response } = require('express');
class UserController {


    getAllUsers(req,res=response){
        res.status(200);
        res.json(userData.users);      
  
    }

    getUserById(req=request,res = response){
    
            const {id} = req.params;
            const user = userData.users.find(u => u.id == id);
            res.status(200);
            res.json(user);

    }

    createUser(req=request,res=response){

        
        const user =  req.body;
        // obtener un id randon 
        user.id=Math.floor(Math.random() * 1000000) + 10;
        const existe = userData.users.find(u =>(u.email == user.email));
        console.log('user'+user);

            if(user.userName !== '' && user.email !== '' && user.password !== ''){
                if(!existe){

                    userData.users.push(user);

                    res.status(201);
                    res.json(user);
                }
                else{
                    res.status(400);
                    res.json({mssg: "The user already exists!"});
                }
            }
            else{
                res.status(422);
                res.json({mssg: "Invalid data"});
           }

        
    }

    deleteUser(req,res){

    }

    login(req=request,res=response){
           console.log( 'BODY: ', req.body)
            const {email,password} =  req.body;
            console.log(email);
            const existe = userData.users.find(u =>(u.email == email && u.password == password));
            console.log('<<<<<'+existe);
            if(existe != undefined){
                res.status(200);
            }
            else if(existe == undefined){
                res.status(202);
                res.json({mssg: "The user does not exists! Please Sign-up!"});
            }else 
                res.status(400);

            res.json(existe);    

    }

    
}

const userController = new UserController();
module.exports ={userController};