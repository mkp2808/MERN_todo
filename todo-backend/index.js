// Importing Required Packages 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// setup for environment variables
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

const app = express();

// app.use(cors({
//     origin: ['http://localhost:3000',' http://192.168.1.37:3000'], // Replace with your allowed origins
//   }));

app.use(cors());

// used to get the json directly form the body
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

const taskRouter = require('./routes/tasksRoutes')
const authRouter = require('./routes/authRoutes')

app.use('/api',authRouter)
app.use('/api',taskRouter)

app.listen(port,()=>{
    // console.clear();
    console.log('--------------------------------------------------------------------------------------\n')
    console.log(`listening on port http://localhost:${port}\n\n`);
})