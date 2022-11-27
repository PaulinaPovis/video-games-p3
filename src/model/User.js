class User {

    constructor(id,userName,email,password,avatar,color){
        this.id=id;
        this.userName=userName;
        this.email= email;
        this.password= password;
        this.avatar= avatar;
        this.color='none';
    }

}



const user = new User();
module.exports={user};