var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var db = require('./models/index.js')
var Validator = require('./router/Validator.js');
var Session = require('./router/Session.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(function(error, req, res, next) {
   if (error instanceof SyntaxError) {
      console.log("SyntaxError: ", error);
      res.status(500).json(error.stack).end();
   } else {
      next();
   }
});

app.use(cookieParser());

app.use(Session.router);
/* Add validator and database utilities to request */
app.use(function(req, res, next) {
  console.log(req.path, req.method)
  if (req.session || req.method === 'POST' &&
   (req.path === '/api/users/' || req.path === '/api/auth/')) {
    req.validator = new Validator(req, res);
    req.db = db;
    next();
  } else {
    res.status(401).end();
  }
})

app.use('/api/auth', require('./router/routes/auth.js'));
app.use('/api/users', require('./router/routes/users.js'));

app.delete('/api/DB', function(req, res) {
  db.sequelize.transaction(function(t) {
    var options = { raw: true, transaction: t }

    return db.sequelize
      .query('SET FOREIGN_KEY_CHECKS = 0', options)
      .then(function() {
        return db.sequelize.query('truncate table songs', options)
      })
      .then(function() {
        return db.sequelize.query('truncate table users', options)
      })
      .then(function() {
        return db.sequelize.query('truncate table queues', options)
      })
      .then(function() {
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
  }).then(function() {
    db.users.create({
      username: "admin",
      first_name: "Patrick",
      last_name: "Cook",
      role: "admin",
      created_at: new Date()
    })
    .then(user => {
      res.json(user);
    });
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send("Page not found: 404").end()
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Express listening on port:', 3000);
  });
});
