const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: "mongodb://0.0.0.0/E-commerce",
  collection: "session"
});

module.exports = session({
  saveUninitialized: true,
  secret: 'sessionSecret',
  resave: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 24 * 10 // 10 days
  }
});
