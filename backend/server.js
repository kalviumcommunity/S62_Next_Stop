const express = require('express')
const app = express();
app.get('/ping',(request,response)=>{
    return response.send('pong')

})
const PORT=8080
app.listen(PORT,()=>{
    console.log(`server is running in http://localhost:${PORT}`)
})