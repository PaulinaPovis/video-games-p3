
/**
 * Almacena la celda tomada por el judador
 */
class CellTaken {

    constructor(user,cell,color){

        this.user=user;
        this.cell=cell;
        this.color=color;

    }

}

const cellTaken = new CellTaken();
module.exports= {cellTaken};