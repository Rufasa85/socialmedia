const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./config/connection")
const db = require("./models")

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const session = require("express-session")
const SequelizeStore = require('connect-session-sequelize')(session.Store);
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*60*2
    },
    store: new SequelizeStore({
        db: sequelize,
      })
}))


const allRoutes = require("./controllers")
app.use(allRoutes);

sequelize.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
        console.log(`listenin to the smooth sounds of port ${PORT}`)
    })
})