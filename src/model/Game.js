const { cell } = require("./Cell");
const { user } = require("./User");
const { room } = require("./Room");
class Game {

    constructor(id,players,room,status,cells){
        this.id=0;
        this.players=Array(user);
        this.room=room;
        this.status='TERMINATED';
        this.cells=Array(cell);
        
    }

}
const game = new Game();
module.exports={game};