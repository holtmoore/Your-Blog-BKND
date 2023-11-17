const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'mysecretsshhh';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


mongoose.connect('mongodb+srv://doueven1996:lw8MoggF9kEWTdmJ@cluster0.b0gmr3u.mongodb.net/')

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
    const userDoc = await User.create({username, password: bcrypt.hashSync(password, salt)});
  res.json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
   const userDoc = await User.findOne({username});
   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (passOk) {
    jwt.sign({username,id: userDoc._id}, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json('ok');
    });
   } else {
         res.status(400).json({message: 'Wrong password'});
   }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
})

app.post('/logout', (req, res) => {
    res.clearCookie('token').json('ok');
});

app.listen(4000, () => console.log('Server running on port 4000'));
//mongodb+srv://doueven1996:lw8MoggF9kEWTdmJ@cluster0.b0gmr3u.mongodb.net/