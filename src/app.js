const express = require('express');
const app = express();

app.use((req,res)=>{
    console.log("Middleware 1");
});

app.use('/',(res,req)=>{
    res.send("Hello World");
});

app.listen(3000,() =>{
    console.log("Server is running on port 3000");
});

