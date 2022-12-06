import {basePath} from './base.js';
import {ApiManager} from './ApiManager.js';
/**
 * Clase que gestiona las llamadas a los servicios relacionados con el game
 */
export class GameServices{
    
    /**
     * Llama al servicio para mostrar todos los games activos
     * @return {Promise} JSON con la promesa
     */
    static getAllGames(){
        return new Promise((resolve, reject) => {
            ApiManager.get(`${basePath}/games`)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Llama al servicio para mostrar un game por su id
     * @param {Number} gameId id del juego
     * @return {Promise} JSON con la promesa  
     */
    static getGameById(gameId){
        return new Promise((resolve, reject) => {
            ApiManager.get(`${basePath}/games/${gameId}`)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Llama al servicio para crear un nuevo juego
     * @param {Object} data Objeto con los datos del usuario y la sala
     * @return {Promise} JSON con la promesa 
     */
    static createGame(data){
        return new Promise((resolve, reject) => {
            ApiManager.post(`${basePath}/games`, data)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Llama al servicio para añadir un nuevo jugador a la partida
     * @param {Object} data Objeto con los datos del usuario
     * @param {Number} gameId id del juego
     * @return {Promise} JSON con la promesa  
     */
    static addPlayerOnGame(data, gameId){
        return new Promise((resolve, reject) => {
            ApiManager.post(`${basePath}/games/${gameId}/players`, data)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Llama al servicio para añadir una nueva posición de una celda en el juego
     * @param {Object} data Objeto con los datos de celda y color del jugador
     * @param {Number} cellNumber número de celda
     * @param {Number} gameId id del juego
     * @return {Promise} JSON con la promesa 
     */
    static putCellOnGame(data, gameId, cellNumber){
        return new Promise((resolve, reject) => {
            ApiManager.put(`${basePath}/games/${gameId}/cells/${cellNumber}`, data)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Elimina un jugador de una partida de una room
     * @param {Object} data Objeto con los datos del usuario
     * @param {Number} gameId id del juego
     * @param {Number} playerId id del jugador
     * @return {Promise} JSON con la promesa  
     */
    static deletePLayerOnGame(data, gameId, playerId){
        return new Promise((resolve, reject) => {
            ApiManager.delete(`${basePath}/games/${gameId}/players/${playerId}`, data)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Elimina un juego por su id
     * @param {String} gameId id del juego
     * @return {Promise} JSON con la promesa
     */
    static deleteGameById(gameId){
        return new Promise((resolve, reject) => {
            ApiManager.delete(`${basePath}/games/${gameId}`)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

    /**
     * Elimina un usuario de una room
     * @param {Object} data Objeto con los datos del usuario
     * @param {Number} roomId id del room 
     * @return {Promise} JSON con la promesa 
     */
    static deletePLayerOnRoom(data, roomId){
        return new Promise((resolve, reject) => {
            ApiManager.post(`${basePath}/rooms/${roomId}/delete-user`, data)
            .then(response => resolve(response))
            .catch(err => reject(err))
        });
    };

}