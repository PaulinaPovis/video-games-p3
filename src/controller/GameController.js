const { gameData } = require("../data/GameData");
const { request, response } = require("express");
const { cell } = require("../model/Cell");
const { game } = require("../model/Game");

class GameController {
  getAllGames(req, res = response) {
    res.status(200);
    res.json(gameData.games);
  }

  getGameById(req = request, res = response) {
    try{
      const { idgame } = req.params;
      console.log("idgame:" + idgame);
      const game = gameData.games.find((u) => u.id == idgame);
      console.log("game:" + game);
      if (!game)
        throw new Error("The game not exists: "+idgame );
      res.status(200);
      res.json(game);
    }
    catch(e) {
      console.error(e);
      res.status(400);
      res.json({ msg: "" + e });
    }
  }

  
  deleteGameById(req = request, res = response) {
    const { idgame } = req.params;
    console.log("idgame:" + idgame);

    try{

      const game = gameData.games.filter((u) => u.id == idgame);
      if (game.length != 1)
        throw new Error("The game not exists: "+idgame );

      
      gameData.games = gameData.games.filter((u) => u.id != idgame);    

      console.log("game:" + game);
      res.status(204);
      res.json();

    }catch(e){
      console.error(e);
      res.status(400);
      res.json({ msg: "" + e });
    }



  }

  createGame(req = request, res = response) {
    const { player, room } = req.body;
    const game = {};
    // obtener un id randon
    game.id = Math.floor(Math.random() * 1000000) + 10;
    game.players = [];

    //generando color aleatorio
    player.color =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();

    game.players.push(player);
    game.room = room;
    game.status = "CREATED";
    game.cells = [];
    // inicializamos las celdas
    var idCell = 1;
    for (var x = 1; x <= 6; x++) {
      for (var y = 1; y <= 6; y++) {
        
        const cell = {};
        cell.id = idCell++;
        cell.color = "NONE";
        cell.positionX = x;
        cell.positionY = y;
        console.log(cell);
        game.cells.push(cell);
      }
    }

    gameData.games.push(game);


    res.status(200);
    res.json(game);
  }

  deletePlayerOnGame(req = request, res = response) {
    try{
      console.log("deletePlayerOnGame ");
      const { idgame,idplayer } = req.params;
      console.log("id-game:" + idgame+" id-player:"+idplayer);

      const game = gameData.games.filter((u) => u.id == idgame);
      if (game.length != 1)
        throw new Error("The game not exists: "+idgame );
      
      const player  =  game[0].players.filter(p=> p.id == idplayer);

      if (player.length != 1)
        throw new Error("The player not exists: "+idplayer);

      gameData.games.forEach(g =>{

        if(g.id == idgame){
            g.players = g.players.filter(p1 => p1.id !=idplayer);
        }

      });


      res.status(204);
      res.json();


    }catch(e){
      res.status(400);
      res.json({ msg: "" + e });
    }


  }

  addPlayerOnGame(req = request, res = response) {
    try {
      const { id, userName, email } = req.body;
      const player = req.body;
      const { idgame } = req.params;
      console.log("id-game " + idgame);
      const existeGame = gameData.games.filter((g) => g.id == idgame);

      if (existeGame.length != 1)
        throw new Error(
          "El usuario " +
            userName +
            " con email " +
            email +
            " no se puede agregar a la partida porque la partida no existe"
        );
      //asignado un color aleatorio
      player.color =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();

      console.log("#1 existe");
      console.log(existeGame);
      console.log("#2 existe");

      gameData.games.forEach((u) => {
        if (u.id == idgame) {
          console.log(">> " + u.email + " " + email);
          if (u.players.length > 0 && u.players.length < 2) {
            //validamos si el usuario ya existe en el array de players
            u.players.forEach((p) => {
              if (p.email == email)
                throw new Error(
                  "El usuario " +
                    userName +
                    " con email " +
                    email +
                    " ya existe en la partida"
                );
            });
          }

          if (u.players.length >= 2)
            throw new Error("ya existe dos usuarios en la partida");

          console.log(player);
          u.players.push(player);
        }
      });

      res.status(200);
      res.json(player);
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json({ msg: "" + e });
    }
  }

  updateCellByIdFromGameById(req = request, res = response) {
    try {
      const cell = req.body;
      //inicio: valida si existen los datos enviados y devuelve la celda si exite
      const { idgame, idcell } = req.params;
      const gameSelected = gameData.games.filter((g) => g.id == idgame)[0];

      if (gameSelected == undefined)
        throw new Error("The game id " + idgame + " not exists ");

      const cellSelected = gameSelected.cells.filter((c) => c.id == idcell)[0];

      if (cellSelected == undefined)
        throw new Error("The cell id " + idcell + " not exists ");
      // fin : validacion si existe el game y cell

      // la cell no se puede registrar si no existe los 2 players
      if (gameSelected.players.length < 2)
        throw new Error(
          "The cell id " +
            idcell +
            " can't be register, because not exist 2 players"
        );

      //validar si el color enviado pertenece a un player
      const existColor = gameSelected.players.filter(
        (p) => p.color == cell.color
      );
      if (existColor == undefined || existColor.length == 0)
        throw new Error("The cell color not exist " + cell.color);

      const existContiguous = gameSelected.cells.filter(
        (c) =>
          (c.positionX == cellSelected.positionX + 1 &&
            c.positionY == cellSelected.positionY &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX + 1 &&
            c.positionY == cellSelected.positionY &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX &&
            c.positionY == cellSelected.positionY + 1 &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX &&
            c.positionY == cellSelected.positionY - 1 &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX + 1 &&
            c.positionY == cellSelected.positionY + 1 &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX + 1 &&
            c.positionY == cellSelected.positionY - 1 &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX - 1 &&
            c.positionY == cellSelected.positionY + 1 &&
            c.color == cell.color) ||
          (c.positionX == cellSelected.positionX - 1 &&
            c.positionY == cellSelected.positionY - 1 &&
            c.color == cell.color)
      );

      console.log(existContiguous);

      //validar si el color existe registrado en las celdas
      gameData.games.forEach((g) => {
        // solo se actualizara el gameselected
        if (g == gameSelected) {
          // solo se actualizara las celdas del game selected
          const existCellSelected = g.cells.filter(
            (cs) => cs.color == cell.color
          );
          if (existCellSelected == undefined || existCellSelected.length == 0) {
            g.cells.forEach((c) => {
              if (c.id == cell.id) {
                if (c.color != "NONE")
                  throw new Error("The cell is fill by " + c.color);

                c.color = cell.color;
              }
            });
          } else {
            // si ya existiera una celda registrada con el color enviado pues hay que validar que sea contigua y no este ocupada
            console.log("el color y la celda ya esta registrada");

            g.cells.forEach((c) => {
              if (c.id == cell.id) {
                // si el color enviado ya esta ocupado damos un error que esta ocupado
                if (c.color != "NONE")
                  throw new Error("The cell is fill by " + c.color);

                // Si  esta NONE debo buscar que algun contiguo tengan el mismo color de lo contrario lanzo un error
                if(existContiguous == undefined || existContiguous.length==0)
                throw new Error("Not exits cell contiguous for cell " + cell.id +" and color "+ cell.color);

                c.color = cell.color;
              }
            });
          }
        }
      });

      res.status(200);
      res.json(cell);
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json({ msg: "" + e });
    }
  }
  getCellByIdFromGameById(req = request, res = response) {
    try {
      //inicio: valida si existen los datos enviados y devuelve la celda si exite
      const { idgame, idcell } = req.params;
      const gameSelected = gameData.games.filter((g) => g.id == idgame)[0];

      if (gameSelected == undefined)
        throw new Error("The game id " + idgame + " not exists ");

      const cellSelected = gameSelected.cells.filter((c) => c.id == idcell)[0];

      if (cellSelected == undefined)
        throw new Error("The cell id " + idcell + " not exists ");
      // fin : validacion si existe el game y cell

      res.status(200);
      res.json(cellSelected);
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json({ msg: "" + e });
    }
  }
}
const gameController = new GameController();
module.exports = { gameController };
