require('dotenv').config;
const express = require('express');
const session = require('express-session');
const db = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const secretSession = process.env.SESSION_CODE;

if (!secretSession) {
  throw new Error('SESSION_CODE is not defined in environment variables');
}

const port = process.env.port || 3000;

const app = express();



app.use(express.urlencoded({ extended: false }));



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
