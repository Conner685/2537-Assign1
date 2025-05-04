require('dotenv').config;
const express = require('express');
const session = require('express-session');
const db = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const secretSession = process.env.SESSION_CODE;
const dbSecret = process.env.MONGO_SECRET;
const dbUser = process.env.MONGO_USER;
const dbPassword = process.env.MONGO_PASSWORD;
const dbHost = process.env.MONGO_HOST;

if (!secretSession) {
  throw new Error('SESSION_CODE is not defined in environment variables');
}

const port = process.env.port || 3000;

const app = express();

const expireTime = 1000 * 60 * 60;

const mongoDB = db.create({
  mongoUrl: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/sessions`,
	crypto: {
		secret: dbSecret
	}
});

app.use(session({ 
  secret: secretSession,
store: mongoDB, 
saveUninitialized: false, 
resave: true
}
));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req,res) => {
  res.send("<h1>World Hello!</h1>");
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
