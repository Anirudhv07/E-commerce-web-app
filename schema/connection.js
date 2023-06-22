const dotenv= require('dotenv')
dotenv.config()
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "session"
})

module.exports = session({
  saveUninitialized: true,
  secret: 'sessionSecret',
  resave: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 24 * 10 // 10 days
  }
});
