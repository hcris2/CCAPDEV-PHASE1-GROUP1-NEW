const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const app = express()
const dotenv = require('dotenv');
const router = express.Router();
const MemoryStore = require('memorystore')(session)


app.use(express.json())
app.use(express.urlencoded({extended:false}))


dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to DB'))

app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false, 
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: { maxAge: 1800000  } // 30 minutes
    }));

const User = require('./models/User.js')

// Add a middleware to set the user in the request object if the session has a user id
app.use(async function (req, res, next) {
    if (req.session && req.session.userId) {
        try {
            req.user = await User.findById(req.session.userId);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


const taskRoute = require('./routes/taskRoute.js');
const notifRoute = require('./routes/notifRoute.js');
const stylesRoute = require('./routes/stylesRoute.js');
const javascriptRoute = require('./routes/javascriptRoute.js');
const htmlRoute = require('./routes/htmlRoute.js');
const userRoute = require('./routes/userRoute.js');


app.use('/api/tasks', taskRoute);
app.use('/api/notifications', notifRoute);
app.use('/styles', stylesRoute);
app.use('/javascript', javascriptRoute);
app.use('/user', userRoute);
app.use('/', htmlRoute);


app.listen(3000, () => {
     console.log('Hello Listening at http://localhost:3000')
})
