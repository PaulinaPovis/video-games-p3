const squares = document.querySelectorAll('.board-item');


squares.forEach((item) => {
    item.addEventListener('click', function(event){
        console.log(event.target)
        console.log(event.target.id)
    })
})