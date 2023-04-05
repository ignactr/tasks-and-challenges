const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

const showChallenges = require('./routes/showChallenges.js')

app.use('/api/showChallenges', showChallenges);

//launching server
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

//connecting to mongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/tasks-and-challenges').then(()=> {
    console.log('Connected to database');
}).catch((error) => {
    console.error('Failed to connect to database: ',error);
});