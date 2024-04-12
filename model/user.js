module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return users;
};
