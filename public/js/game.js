import { GameServices } from "./classes/api/GameServices.js";
import { Player } from "./classes/Player.js";
import { WinStorage } from "./classes/WindowStorageManager.js";

const socket = io();
 
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
const boardSquares = document.querySelectorAll(`#room-${roomSelected.id} .board-item`);
const boardSquaresCanvas = document.querySelectorAll(`#room-${roomSelected.id} .board-item canvas`);

document.querySelector('.header').classList.add('hide');
document.querySelector('.footer').classList.add('hide');

let playerOneScore = 0;
let playerTwoScore = 0;
let gameId;
let players = [{}, {}];



    boardSquaresCanvas.forEach(element => {
        const ctx = element.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, element.width, element.height);

    })

/**
 * Funci??n que gestiona el inicio de la partida
 */
function initGame(){
    let gameExist = false;
    let isGameCreated = false;

    //comprobamos si existe alg??n juego activo con nuestro id de room
    GameServices.getAllGames()
        .then(response => {
            
            // Comprobamos si el array de la respuesta tiene longitud
            if(response.length){
                
                response.forEach(item => {
                    //Si existe un juego con el id de nuestro room a??adimos un jugador
                    if(item.room.id == roomSelected.id){
                        gameExist = true;
                        gameId = item.id;
                        
                    }
                });
            }
            else{
                // Si no tiene longitud creamos el juego
                isGameCreated = true
                setExitButton();
                createNewGame();
            };

            if(gameExist){
                
                addNewPlayerOnGame(gameId)
            }
            if(!gameExist && !isGameCreated){
                
                setExitButton();
                createNewGame();
            }
        });
};


// FUnci??n que inicializa todo
initGame();


/**
 * Acci??n para setear el ot??n de salir del juego
 */
function setExitButton(){
    // Acci??n para sacar a un jugador de la sala
    const btnExitRoom = document.querySelector(`#room-${roomSelected.id} .btn-exit-room`);
    btnExitRoom.style.display = 'inline-block';
    btnExitRoom.addEventListener('click', () => {
        GameServices.deleteGameById(gameId)
        .then(() => {
            //Datos para pasar al servicio
            const data = {
                id: user.id,
                userName: user.userName
            };
            GameServices.deletePLayerOnRoom(data, roomSelected.id)
            .then(() => {
                // Borramos los datos del room en el localStorage
                document.querySelector('.header').classList.remove('hide');
                document.querySelector('.footer').classList.remove('hide');
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
 * Funci??n para crear una nueva partida
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
 * Funci??n para a??adir un nuevo jugador a la partida
 * @param {Number} gameId id del juego 
 */
function addNewPlayerOnGame(gameId){

    const data = {
        id: user.id,
        userName: user.userName,
        email: user.email
    };

    GameServices.addPlayerOnGame(data, gameId)
    .then(() => {
        //Ocultamos el bot??n de salir del juego
        document.querySelector(`#room-${roomSelected.id} .btn-exit-room`).style.display = 'none';

        GameServices.getGameById(gameId)
        .then(response => {
            // Socket env??a mensaje al server para iniciar el juego
            socket.emit(`game::start-${roomSelected.id}`, (response.players));
            
        })
        .catch(err => console.log(err))
    })
    .catch(err => {
        // Gestionar el error
        console.error(err)
    })
};

// Socket recibe mensaje del server para iniciar el juego
socket.on(`game::start-${roomSelected.id}`, (args) => {
    startGame(args)
});

function startGame(args){
    // Datos recibidos del socket:server
    // Aqu?? se podr??a pintar el tablero con los datos del JSON
    const {gamePLayers, json} = args;

    console.log(json)

    // A??adimos el id del juego actual al local storage, ser?? necesario si vamos a hacer logout despu??s
    roomSelected.currentGameId = gameId;
    WinStorage.set('roomSelected', roomSelected);

    //Animaci??n del contador para empezar a jugar
    const countDown = document.querySelector(`#room-${roomSelected.id} .countdown`);
    const countDownMsg = document.querySelector(`#room-${roomSelected.id} .countdown .msg`);
    countDown.classList.add('show');
    
    //Ocultamos el bot??n de salir del juego
    document.querySelector(`#room-${roomSelected.id} .btn-exit-room`).style.display = 'none';

    const arrMessages = ['Ready', '3', '2', '1', 'Go!'];
    let msg;

    const messages = setInterval(function () {
        msg = arrMessages.shift();
          if (msg === undefined) {
           countDown.classList.remove('show')
           clearInterval(messages);
           return;
        }
        countDownMsg.innerHTML = msg;
      },1000);

    // Seteamos los datos del jugador
    const playerOneData = gamePLayers[0];
    Object.assign(playerOneData, {boardPosition: 'left'});
    players[0] = new Player(playerOneData);

    const playerTwoData = gamePLayers[1];
    Object.assign(playerTwoData, {boardPosition: 'right'});
    players[1] = new Player(playerTwoData);
    
    setPlayerOne();
    setPlayerTwo();

    //Recorremos el array de cuadrados del HTML
    boardSquaresCanvas.forEach((element, index) => {
        
        //Asignamos un escuchador con el evento click a cada elemento del array
        element.addEventListener('click', function(event){
            console.log(event)
            const boardItem = boardSquares[index]
            console.log(boardItem)
            const cellSelected = Number(boardItem.id);
            setCell(cellSelected);
        });
    });
}


/**
 * Acci??n para gestionar el n??mero de celda seleccionada
 * @param {Number} cellNumber N??mero de la celda seleccionada
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
            
            // Emitimos mensaje al server para colocar la celda
            socket.emit(`game::set-cell-${roomSelected.id}`, ({
                cellNumber: cellNumber,
                currentPlayer: currentPlayer,
                gameId: gameId
            }));
        }
        else{
            // Gestionar el error
        }
    })
    .catch(err => {
        // Gestionar el error
        console.error(err)
    })
};

// Recibimos mensaje al server para actualizar los datos del juego
socket.on(`game::set-cell-${roomSelected.id}`, (args) => {
    updateGame(args);
});

/**
 * Acci??n para actualizar los datos del juego
 * @param {Object} args objeto con los datos que recibimos del socket:server 
 */
function updateGame(args){
    const {gamePlayercurrentPlayer, json} = args;
    const currentPlayer = players.find(player => Object.keys(player).length && Number(player.player.id) === Number(gamePlayercurrentPlayer.player.id));
    let scoreOne = 0;
    let scoreTwo = 0;

    //Pinta las celdas de su color correspondiente y calcula las puntuaciones
    json.cells.forEach((cell, index) => {
        if(cell.color !== 'NONE'){
            // boardSquares[index].style.backgroundColor = cell.color;
            const currentCanvas = boardSquaresCanvas[index];
            console.log(currentCanvas);
            let ctx = currentCanvas.getContext("2d");
            ctx.fillStyle = cell.color;
            ctx.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
            if(currentPlayer.player.color === cell.color && currentPlayer.player.boardPosition === 'left'){
                scoreOne++;
                playerOneScore = scoreOne;
            }
            if(currentPlayer.player.color === cell.color && currentPlayer.player.boardPosition === 'right'){
                scoreTwo++;
                playerTwoScore = scoreTwo;
            }
        }
    });


    if(currentPlayer.player.boardPosition === 'left'){
        userBoardLeftScore.innerHTML = `${playerOneScore}/36`;
        userBoardLeftPercentage.innerHTML = `${setPercentage(playerOneScore)}%`;
    }
    else{
        userBoardRightScore.innerHTML = `${playerTwoScore}/36`;
        userBoardRightPercentage.innerHTML = `${setPercentage(playerTwoScore)}%`;
    }

    // l??gica del ganador
    if(playerOneScore + playerTwoScore === json.cells.length){
        winText.classList.add('show');

        // l??gica del ganador si hay empate
        if(playerOneScore === playerTwoScore){
            winText.innerHTML = `${players[0].player.userName} & ${players[1].player.userName} are tie!!`;
        }
        else if(playerOneScore > playerTwoScore){
            // l??gica del ganador playerOne
            winText.innerHTML = `${players[0].player.userName} wins!!`;
        }
        else{
            // l??gica del ganador playerTwo
            winText.innerHTML = `${players[1].player.userName} wins!!`;
        }

        //Mostramos el bot??n de salir del juego
        setExitButton();
    }
}


// Acci??n que calcula el porcentaje
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
