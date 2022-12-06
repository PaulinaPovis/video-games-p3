/**
 * Clase que representa un jugador
 */
export class Player{
    player = undefined;
    position = undefined;
    score = 0;

    constructor(playerData){
        this.player = playerData;
    };

    /**
     * Método para añadir puntos al usuario
     */
    setScore(){
        this.score ++;
    };

    /**
     * Devuelve el usuario
     * @return {Object} con el usuario
     */
    getPlayer(){
        return this.player;
    };

    /**
     * Devuelve la puntuación del usuario
     * @return {Number}
     */
    getScore(){
        return this.score;
    };
}