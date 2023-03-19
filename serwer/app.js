const express = require("express");
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/tasks-and-challenges').then(()=> {
    console.log('Connected to database');
}).catch((error) => {
    console.error('Failed to connect to database: ',error);
});