const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({path: './backend/.env'});

const postsRoutes = require('./routes/posts')
const authRoutes = require('./routes/auth')


mongoose.connect(process.env.MONGODB_URI)
    .then(()=> {
        console.log('Connected to database!')
    })
    .catch(()=>{
        console.log('Connection failed!')
    })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/uploads', express.static(path.join('uploads')))

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        );
    next();
})


app.use('/api/posts', postsRoutes)
app.use('/api/auth', authRoutes)

module.exports = app