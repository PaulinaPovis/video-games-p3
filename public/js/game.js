import positionsJson from '../board-position.json' assert {type: 'json'};
import { WinStorage } from "./classes/WindowStorageManager.js";

// Variables necesarias y nodos del DOM
const user = WinStorage.getParsed('currentUser');
const roomSelected = WinStorage.getParsed('roomSelected');
const squares = document.querySelectorAll('.board-item');
let player = undefined;
let gameId = undefined;
let hasTwoPlayers = false;
let lastBoardPosition = undefined;

// Comprobamos si ya existe alguna partida y si existe alguna partida en nuestra sala
function checkIfGameExist(){
    fetch('http://localhost:3000/api/games')
    .then(data => data.json()) 
    .then(response => {
        if(response.length){
            response.forEach(item => {
                
                if(item.room.id == roomSelected.id){
                    
                    gameId = item.id;
                    addPlayer(gameId);
                }
                else{
                    //Invocamos la función nada más iniciar la vista para que cree la partida
                    createGame();
                }
            });
        }
        else{
            
            //Invocamos la función nada más iniciar la vista para que cree la partida
            createGame();
        } 
    }) 
};

checkIfGameExist();

// Acción para crear la partida llamando al servicio
function createGame(){
    //Datos para pasar al backend
    const data = {
        player: {
            id: user.id,
            userName: user.userName,
            email: user.email
        },
        room: {
            id: roomSelected.id,
            name: roomSelected.name
        }
    };

    fetch('http://localhost:3000/api/games', {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers(
            {
                'Content-Type':  'application/json'
            }
        )          
    })
    .then(data => data.json()) 
    .then(response => {
        /**
         * 1 - Si va bien, asignamos valor a la variable player con el jugador que nos devuelve el
         * servicio con el mismo id
         * 
         * 2 - Iniciamos el juego con la función startGame TODO: Aquí deberíamos poder saber si el juego
         * ya está listo para poder jugar (2 jugadores), ahora mismo no sé si se puede saber
         */

        player = response.players.find(item => item.id === user.id);
        gameId = response.id;
        console.log(player);
        startGame();
    })
    .catch((err) => {
        //Si va mal
        console.log(err)
    })
};


// Acción para añadir un jugador a la sala
function addPlayer(gameId){

    const data = {
        id: user.id,
        userName: user.userName,
        email: user.email
    };

    fetch(`http://localhost:3000/api/games/${gameId}/players`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers(
            {
                'Content-Type':  'application/json'
            }
        )          
    })
    .then(data => data.json())
    .then(response => {
        console.log(response);
        player = response;
        startGame();
    })
    .catch((err) => {
        //Si va mal
        console.log(err)
    })
};

// Acción para setear los colores y datos del tablero
function setBoards(leftColor, rightColor){
    const userNameLeft = document.getElementById('board-user-left');
    const svgLeft = document.querySelectorAll('svg-left path');
    const userNameRight = document.getElementById('board-user-right');
    const svgRight = document.querySelectorAll('svg-right path');
}


//Acción para comenzar el juego
function startGame(){
    //Recorremos el array de cuadrados del HTML
    squares.forEach((element) => {
        //Asignamos un escuchador con el evento click a cada elemento del array
        element.addEventListener('click', function(event){
            
            const selected = Number(event.target.id);
            const boardPosition = positionsJson.positions.find(item => item.id === selected)
    
            fetchCell(selected);
        })
    });
}


// Acción para llamar al backend con el número de celda seleccionada
function fetchCell(cellNumber){
    //Datos a enviar al backend
    const data = {
        id: cellNumber,
        color: player.color
    }
    fetch(`http://localhost:3000/api/games/${gameId}/cells/${cellNumber}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers(
            {
                'Content-Type':  'application/json'
            }
        )          
    })
    .then(data => data.json()) 
    .then(response => {
        
        if(response.msg === "Error: The cell id 9 can't be register, because not exist 2 players"){
            //Todavía no hay dos jugadores
        }
        else{
            //Ya hay dos jugadores
            hasTwoPlayers = true;
        }
    }) 
    .catch((err) => {
        console.log(err)
    }) 
}