'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')["env"];
var db        = {};

 var sequelize = new Sequelize(config.database, config.username, config.password, config);


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });



db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* /Models/tables */
db.user = require('../models/user.js')(sequelize, Sequelize);
db.song = require('../models/song.js')(sequelize, Sequelize);
db.queue = require('../models/queue.js')(sequelize, Sequelize);
db.vote = require('../models/vote.js')(sequelize, Sequelize);
//db.songVotes = require('../models/songvotes.js')(sequelize, Sequelize);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
