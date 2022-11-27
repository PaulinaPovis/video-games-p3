const { game } = require("../model/Game");

class GameData{
    // solo mostrare los game creados
    games = Array(game).filter(d=>d.id>0);
}
const gameData = new GameData();
module.exports = { gameData };