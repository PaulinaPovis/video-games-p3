import { GameServices } from "./classes/api/GameServices.js";
import { Player } from "./classes/Player.js";
import { WinStorage } from "./classes/WindowStorageManager.js";

// Socket.io
const io = io();
// Variables necesarias y nodos del DOM
const user = WinStorage.getParsed('currentUser');
const roomSelected = WinStorage.getParsed('roomSelected');
//Nodos para setear los boards
const userNameLeft = document.querySelector(`#room-${roomSelected.id} #board-user-left`);
const userBoardLeft = document.querySelector(`#room-${roomSelected.id} .user-board-left`);
const userBoardLeftScore = document.querySelector(`#room-${roomSelected.id} .user-board-left .user-score .text`);
const userBoardLeftPercentage = document.querySelector(`#room-${roomSelected.id} .user-board-left .user-percentage .text`);
const userBoardLeftNoUser = document.querySelector(`#room-${roomSelected.id} .user-board-left-no-user`);
const svgLeft = document.querySelectorAll(`#room-${roomSelected.id} #svg-left path`);
const userNameRight = document.querySelector(`#room-${roomSelected.id} #board-user-right`);
const userBoardRight = document.querySelector(`#room-${roomSelected.id} .user-board-right`);
const userBoardRightScore = document.querySelector(`#room-${roomSelected.id} .user-board-right .user-score .text`);
const userBoardRightPercentage = document.querySelector(`#room-${roomSelected.id} .user-board-right .user-percentage .text`);
const userBoardRightNoUser = document.querySelector(`#room-${roomSelected.id} .user-board-right-no-user`);
const svgRight = document.querySelectorAll(`#room-${roomSelected.id} #svg-right path`);
const winText = document.querySelector(`#room-${roomSelected.id} .final`);

console.log(winText)
let leftBoardPositions = 36;
let gameId, winner;
let players = [{}, {}];
let player = undefined;


/**
 * Función que gestiona el inicio de la partida
 */
function initGame(){
    const boardSquares = document.querySelectorAll(`#room-${roomSelected.id} .board-item`);

    //comprobamos si existe algún juego activo con nuestro id de room
    GameServices.getAllGames()
        .then(response => {
            debugger
            // Comprobamos si el array de la respuesta tiene longitud
            if(response.length){

                response.forEach(item => {
                    //Si existe un juego con el id de nuestro room añadimos un jugador
                    if(item.room.id == roomSelected.id){
                        gameId = item.id;
                        addNewPlayerOnGame(gameId)
                    }
                    else{
                        setExitButton();
                        // Si no existe un juego con nuestra sala lo creamos
                        createNewGame();
                    }
                });
            }
            else{
                setExitButton();
                // Si no tiene longitud creamos el juego
                createNewGame();
            };
        });

    //Recorremos el array de cuadrados del HTML
    boardSquares.forEach((element) => {

        //Asignamos un escuchador con el evento click a cada elemento del array
        element.addEventListener('click', function(event){
            const cellSelected = Number(event.target.id);
            console.log(players);
            setCell(cellSelected);
        });
    });
};

initGame();

function setExitButton(){
    // Acción para sacar a un jugador de la sala
    const btnExitRoom = document.querySelector(`#room-${roomSelected.id} .btn-exit-room`);
    btnExitRoom.style.display = 'inline-block';
    btnExitRoom.addEventListener('click', () => {
        GameServices.deleteGameById(gameId)
        .then(() => {
            const data = {
                id: user.id,
                userName: user.userName
            };
            GameServices.deletePLayerOnRoom(data, roomSelected.id)
            .then(() => {
                // Borramos los datos del room en el localStorage
                WinStorage.removeItem('roomSelected');
                window.location.href = '/rooms.html';
            })
            .catch(err => {
                console.error(err)
            });
        })
        .catch(err => {
            console.error(err)
        })
    });
}

/**
 * Función para crear una nueva partida
 */
function createNewGame(){
    //Datos para pasar al servicio
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

    GameServices.createGame(data)
    .then(response => {
        gameId = response.id;
        const playerData = response.players[0];
        Object.assign(playerData, {boardPosition: 'left'});
        players[0] = new Player(playerData);
        setPlayerOne();
    })
    .catch((err) => {
        // Gestionar el error
        console.error(err)
    })
};

/**
 * Función para añadir un nuevo jugador a la partida
 * @param {Number} gameId id del juego 
 */
function addNewPlayerOnGame(gameId){

    const data = {
        id: user.id,
        userName: user.userName,
        email: user.email
    };

    GameServices.addPlayerOnGame(data, gameId)
    .then(response => {
        //Ocultamos el botón de salir del juego
        document.querySelector(`#room-${roomSelected.id} .btn-exit-room`).style.display = 'none';
        const playerData = response;
        Object.assign(playerData, {boardPosition: 'right'});
        players[1] = new Player(response)
        // Se guardan e intercambian los datos de los jugadores que hay en cada sala
        setPlayerOne();
        setPlayerTwo();
        console.log(players);
        io.emit('game:player-1', (players));
        io.emit('game:player-2', (players));
    })
    .catch(err => {
        // Gestionar el error
        console.error(err)
    })
};


/**
 * Acción para gestionar el número de celda seleccionada
 * @param {Number} cellNumber Número de la celda seleccionada
 */
function setCell(cellNumber){
    const currentPlayer = players.find(player => Object.keys(player).length && Number(player.player.id) === Number(user.id));
    
    const data = {
        id: cellNumber,
        color: currentPlayer.player.color
    };

    GameServices.putCellOnGame(data, gameId, cellNumber)
    .then(response => {
        if(!response.msg){
            //Gestionar la puntuación del jugador
            currentPlayer.setScore();

            leftBoardPositions = leftBoardPositions - 1;

            if(currentPlayer.player.boardPosition === 'left'){
                userBoardLeftScore.innerHTML = `${currentPlayer.getScore()}/36`;
                userBoardLeftPercentage.innerHTML = `${setPercentage(currentPlayer.getScore())}%`;
            }
            else{
                userBoardRightScore.innerHTML = `${currentPlayer.getScore()}/36`;
                userBoardRightPercentage.innerHTML = `${setPercentage(currentPlayer.getScore())}%`;
            }

            // lógica del ganador
            if(leftBoardPositions === 0){
                winText.classList.add('show');

                // lógica del ganador si hay empate
                if(players[0].score === 18 && players[1].score === 18){
                    winText.innerHTML = `${players[0].player.userName} &  ${players[1].player.userName} are tie!!`;
                }
                else{
                    // lógica del ganador si NO hay empate
                    winText.innerHTML = `${currentPlayer.player.userName} wins!!`;
                }

                //Mostramos el botón de salir del juego
                setExitButton();
            }
        }
        else{
            // ERROR
        }
    })
    .catch(err => {
        // Gestionar el error
        console.error(err)
    })
};


// Acción que calcula el porcentaje
function setPercentage(value){
    const total = 36;
    return Math.round(100 * value / total);  
};

// Setea el board del HTML del jugador 1
function setPlayerOne(){
    userBoardLeft.classList.add('show');
    userBoardLeftNoUser.classList.add('hide');
    userNameLeft.innerHTML = players[0].player.userName;
    svgLeft.forEach(item => {
        item.style.fill = players[0].player.color;
    });

};

// Setea el board del HTML del jugador 2
function setPlayerTwo(){
    userBoardRight.classList.add('show');
    userBoardRightNoUser.classList.add('hide');
    userNameRight.innerHTML = players[1].player.userName;
    svgRight.forEach(item => {
        item.style.fill = players[1].player.color;
    });
};
