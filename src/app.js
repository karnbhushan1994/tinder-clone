const express = require('express');
const app = express();
const  { adminAuth } = require('./middlewares/auth');

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});
