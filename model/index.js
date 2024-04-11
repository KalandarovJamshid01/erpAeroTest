const dbConfig = require('./../config/dbConfig');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  dbConfig.db,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  }
);
const users = require('./user');
const files = require('./file');

sequelize
  .authenticate()
  .then(() => {
    console.log('connected..');
  })
  .catch((err) => {
    console.log('Error' + err);
  });

const db = {};
db.users = users(sequelize, DataTypes);
db.files = files(sequelize, DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users.hasMany(db.files);
db.files.belongsTo(db.users);

db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!');
});

module.exports = db;
