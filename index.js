require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const Joi = require("joi");
const connectToDatabase = require('./databaseConnections');

const secretSession = process.env.SESSION_CODE;
const dbSecret = process.env.MONGO_SECRET;
const dbUser = process.env.MONGO_USER;
const dbPassword = process.env.MONGO_PASSWORD;
const dbHost = process.env.MONGO_HOST;
const dbName = process.env.MONGODB_DATABASE;

if (!secretSession) {
  throw new Error('SESSION_CODE is not defined in environment variables');
}

const port = process.env.PORT || 3000;
const app = express();
const expireTime = 1000 * 60 * 60; // 1 hour

let db;
(async () => {
  db = await connectToDatabase();
})();

const mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/sessions`,
  crypto: {
    secret: dbSecret
  },
  collectionName: 'sessions'
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: secretSession,
  store: mongoStore,
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: expireTime,
    httpOnly: true
  }
}));

app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`
      <h1>Hello, ${req.session.user.name}!</h1>
      <a href="/members">Members Area</a><br>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/signup">Sign up</a><br>
      <a href="/login">Log in</a>
    `);
  }
});


app.get("*", (req, res) => {
  res.status(404).send("Page not found - 404");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});