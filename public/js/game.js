import { WinStorage } from "./classes/WindowStorageManager.js";

const socketIO = io();

// Variables necesarias y nodos del DOM
const btnExitRoom = document.getElementById('btn-exit-room');
const user = WinStorage.getParsed('currentUser');
const roomSelected = WinStorage.getParsed('roomSelected');
const squares = document.querySelectorAll('.board-item');
let player = undefined;
let gameId = undefined;
let hasTwoPlayers = false;
let lastBoardPosition = undefined;
let playerOne, playerTwo

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

        if(response.msg){
            //Ha habido un error
            console.log(response.msg)
        }
        else{
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
            socketIO.emit('game:player-1', (player));
            startGame();
        }
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
        if(response.msg){
            //Ha habido un error
        }
        else{
            console.log(response);
            player = response;
            socketIO.emit('game:player-2', (player));
            startGame();
        }
    })
    .catch((err) => {
        //Si va mal
        console.log(err)
    })
};


//Acción para comenzar el juego
function startGame(){
    //Recorremos el array de cuadrados del HTML
    squares.forEach((element) => {
        //Asignamos un escuchador con el evento click a cada elemento del array
        element.addEventListener('click', function(event){
            
            const selected = Number(event.target.id);
    
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
            if(response.msg && (response.msg.contains('Error: The cell is fill by') || response.msg.contains('Error: Not exits cell contiguous for cell'))){

            }
            else{
                socketIO.emit('game:cell-selected', response);
                
            }
        }
    }) 
    .catch((err) => {
        console.log(err)
    }) 
};


// Acción para borrar un jugador
btnExitRoom.addEventListener('click', () => {
    const data = {
        id: user.id,
        userName: user.userName,
        email: user.email
    };

    fetch(`http://localhost:3000/api/games/${gameId}/players/${user.id}`, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: new Headers(
            {
                'Content-Type':  'application/json'
            }
        )
    })
    .then(() => {
        deleteUserOnRoom();
    })
    .catch((err) => {
        //Si va mal
        console.log(err);
    })
});


//Acción para eliminar un usuario de una sala
function deleteUserOnRoom(){
    const data = {
        id: user.id,
        userName: user.userName
    };

    fetch(`http://localhost:3000/api/rooms/${roomSelected.id}/delete-user`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers(
            {
                'Content-Type':  'application/json'
            }
        )
    })
    .then(() => {
        socketIO.emit('game:delete-player', (user));
        // Borramos los datos del room en el localStorage
        WinStorage.removeItem('roomSelected');
        window.location.href = '/rooms.html';
    })
    .catch((err) => {
        //Si va mal
        console.log(err);
    })
}

//Socket io

//Nodos para setear los boards
const userNameLeft = document.getElementById('board-user-left');
const userBoardLeft = document.querySelector('.user-board-left');
const userBoardLeftNoUser = document.querySelector('.user-board-left-no-user');
const svgLeft = document.querySelectorAll('#svg-left path');
const userNameRight = document.getElementById('board-user-right');
const userBoardRight = document.querySelector('.user-board-right');
const userBoardRightNoUser = document.querySelector('.user-board-right-no-user');
const svgRight = document.querySelectorAll('#svg-right path');

function setPlayerOne(player){
    userBoardLeft.classList.add('show');
    userBoardLeftNoUser.classList.add('hide');
    userNameLeft.innerHTML = player.userName;
    svgLeft.forEach(item => {
        item.style.fill = player.color;
    });

};

function setPlayerTwo(player){
    userBoardRight.classList.add('show');
    userBoardRightNoUser.classList.add('hide');
    userNameRight.innerHTML = player.userName;
    svgRight.forEach(item => {
        item.style.fill = player.color;
    });

};


socketIO.on('game:players', (players) => {
    setPlayerOne(players[0]);
    setPlayerTwo(players[1]);
    
});

socketIO.on('game:player-1', (players) => {
    setPlayerOne(players[0]);
});

socketIO.on('game:players-update', (data) => {
    console.log(data)
    if(data.index === 0){
        userBoardLeft.classList.remove('show');
        userBoardLeftNoUser.classList.remove('hide');
    }
    else{
        userBoardRight.classList.remove('show');
        userBoardRightNoUser.classList.remove('hide');
    }
    // setPlayerOne(players[0]);
    
});

//Escucha los cambios de la selección de la celda y le asigna color
socketIO.on('game:cell-selected', (data) => {
    squares.forEach(element => {
        console.log(element.id)
        if(Number(element.id) ===  data.id){
            element.style.backgroundColor = data.color;
        }
    });
});
