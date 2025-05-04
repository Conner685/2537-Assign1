require('dotenv').config();

const dbHost = process.env.MONGODB_HOST;
const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

const MongoClient = require("mongodb").MongoClient;
const atlasURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true`;
var database = new MongoClient(atlasURI, {});
module.exports = {database};