
/**
 * Clase que gestiona las llamadas a los APIs/servicios
 */
export class ApiManager{

    /**
     * Método para realizar una llamada GET
     * @param {String} url cadena con la url
     * @return {Promise} con el resultado de la llamada
     */
    static get(url){
        return fetch(url)
                .then(data => data.json())
                .catch(err => err)
    };

    /**
     * Método para realizar una llamada POST
     * @param {String} url cadena con la url
     * @param {Object|Array} data datos necesarios para el servicio
     * @return {Promise} con el resultado de la llamada 
     */
    static post(url, data){
        const headers = new Headers(
            { 'Content-Type':  'application/json' }
        );
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers
        })
        .then(data => data.json())
        .catch(err => err)
    };

    /**
     * Método para realizar una llamada PUT
     * @param {String} url cadena con la url
     * @param {Object|Array} data datos necesarios para el servicio
     * @return {Promise} con el resultado de la llamada  
     */
    static put(url, data){
        const headers = new Headers(
            { 'Content-Type':  'application/json' }
        );
        return fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: headers
        })
        .then(data => data.json())
        .catch(err => err)
    };

    /**
     * 
     * Método para realizar una llamada DELETE
     * @param {String} url cadena con la url
     * @param {Object|Array} data datos necesarios para el servicio
     * @return {Promise} con el resultado de la llamada  
     */
    static delete(url, data){
        const headers = new Headers(
            { 'Content-Type':  'application/json' }
        );
        return fetch(url, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: headers
        })
        .then(data => data.json())
        .catch(err => err)
    };
}