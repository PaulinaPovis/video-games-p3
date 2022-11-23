const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

//MiddleWares
app.use(morgan('tiny'));
app.use(cors());

// lectura y parseo de los body
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use( express.static('public') );

// routers
app.use('/api',require('./src/route/UserRouters'));
app.use('/api',require('./src/route/RoomRouters'));


app.listen(3000,()=>{console.log("Servidor arrancado en el puerto 3000")});