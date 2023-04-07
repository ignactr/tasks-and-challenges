const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const showChallenges = require('./routes/showChallenges.js')
const handleRegistration = require('./routes/handleRegistration.js')
const login = require('./routes/login.js')

app.use('/api/showChallenges', showChallenges);
app.use('/api/handleRegistration', handleRegistration);
app.use('/api/login', login);

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