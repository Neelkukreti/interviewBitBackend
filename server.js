const express = require('express');
const connectDB = require('./config/db');
const interview = require('./routes/api/interview');
const app = express();
const cors = require('cors');
const multer = require('multer');
const candidate =require('./routes/api/candidateList');
const interviewer = require('./routes/api/interviewer');

//connect DB
connectDB();

//INITIALIZE MiddleWare here
app.use(multer().array());
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

//Defining routes
app.use('/api/interview', interview);
app.use('/api/candidate', candidate);
app.use('/api/interviewer', interviewer);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening ${PORT}`));

app.get('/', (req, res) => res.send('Green'));
