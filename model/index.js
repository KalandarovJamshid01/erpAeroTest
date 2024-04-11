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

sequelize
  .authenticate()
  .then(() => {
    console.log('connected..');
  })
  .catch((err) => {
    console.log('Error' + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false }).then(() => {
  console.log('yes re-sync done!');
});

module.exports = db;
