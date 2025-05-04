require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');const bcrypt = require('bcrypt');
const saltRounds = 12;
const Joi = require("joi");

const secretSession = process.env.SESSION_CODE;
const dbSecret = process.env.MONGO_SECRET;
const dbUser = process.env.MONGO_USER;
const dbPassword = process.env.MONGO_PASSWORD;
const dbHost = process.env.MONGO_HOST;
const data = process.env.MONGODB_DATABASE;

if (!secretSession) {
  throw new Error('SESSION_CODE is not defined in environment variables');
}

const port = process.env.PORT || 3000;

const app = express();

const expireTime = 1000 * 60 * 60;

var {database} = include('databaseConnection');

const userCollection = database.db(data).collection('users');

const mongoDB = MongoStore.create({
  mongoUrl: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/sessions`,
  crypto: {
    secret: dbSecret
  },
  collectionName: 'sessions'
});

app.use(session({
  secret: secretSession,
  store: mongoDB,
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: expireTime,
    httpOnly: true
  }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get('/', (req,res) => {
  res.send("<h1>World Hello!</h1>");
});

app.get("*", (req,res) => {
	res.status(404);
	res.send("Page not found - 404");
})

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 