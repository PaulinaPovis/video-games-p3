import { basePath } from "./classes/api/base.js";
import { GameServices } from "./classes/api/GameServices.js";
import { WinStorage } from "./classes/WindowStorageManager.js";

/**
 * Recogemos nodos del DOM
 */
const menuHideOnLogin = document.getElementById('menu-hide-on-login');
const menuLogout = document.getElementById('menu-show-on-login');
const userDetail = document.getElementById('user-detail');

const user = WinStorage.getParsed('currentUser');

if(user !== null && user !== undefined){
    
    fetch(`${basePath}/users/` + user.id)
        .then(data => data.json())
        .then(response => {
            if(typeof response !== 'object'){
                menuLogout.classList.add('hide')
                menuHideOnLogin.classList.remove('hide');

                userDetail.classList.add('hide');
                userDetail.classList.remove('user-detail');
            }
            else{
                //Si el usuario esta logueado se muestra el boton logout y se ocultan los botones login y register
                menuLogout.classList.remove('hide');
                menuHideOnLogin.classList.add('hide');
            
                userDetail.classList.remove('hide');
                userDetail.classList.add('user-detail');
                document.querySelector('#user-detail span').innerHTML = response.userName;
                document.querySelector('#user-detail img').src = 'img/avatar-' + response.avatar.id + '.jpg'
            
                createBtnLogout();
            }
        })
        .catch(err => {
            console.log('Error fetch front', err);
            window.location.href = '/login.html';
        })
}
else{
    window.location.href = '/login.html';
}

function createBtnLogout(){
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', function(){
        
        doLogout();
    });
};

function doLogout(){
    const currentUser = WinStorage.getParsed('currentUser');
    const currentRoom = WinStorage.getParsed('roomSelected');
    if(!currentRoom){
        // Borramos los datos del usuario en el localStorage
        WinStorage.removeItem('currentUser');
        menuLogout.classList.add('hide');
        menuHideOnLogin.classList.remove('hide');
        userDetail.classList.add('hide');
        userDetail.classList.remove('user-detail');

        window.location.href = '/login.html';
    }
    else {
        const data = {
            id: currentUser.id,
            userName: currentUser.userName
        }
        fetch(`${basePath}/rooms/${currentRoom.id}/delete-user`, {
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
            console.log(response)

            // Borramos los datos del usuario en el localStorage
            WinStorage.removeItem('currentUser');
            // Borramos los datos del room en el localStorage
            WinStorage.removeItem('roomSelected');
            menuLogout.classList.add('hide');
            menuHideOnLogin.classList.remove('hide');
            userDetail.classList.add('hide');
            userDetail.classList.remove('user-detail');
            GameServices.deleteGameById(currentRoom.currentGameId)

            window.location.href = '/login.html';
        })
        .catch((err) => console.log(err))
    }
    
};
