const express = require("express");
const app = express();
const mongoose = require('mongoose');

const showChallenges = require('./routes/showChallenges.js')

app.use('/api/showChallenges', showChallenges);

//launching server
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

//connecting to mongoDB database
mongoose.connect('mongodb+srv://IgnacyTrocki:haslo123@cluster1.udrw4bw.mongodb.net/tasks-and-challenges?retryWrites=true&w=majority').then(()=> {
    console.log('Connected to database');
}).catch((error) => {
    console.error('Failed to connect to database: ',error);
});