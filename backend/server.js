if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080
const connectDataBase = require('./DB/database.js');
const mongoose=require('mongoose')


app.get('/ping',(request,response)=>{
    return response.send('pong')

})

app.listen(PORT,()=>{
    connectDataBase()
    console.log(`server is running in http://localhost:${PORT}`)
})