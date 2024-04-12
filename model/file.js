module.exports = (sequelize, DataTypes) => {
  const files = sequelize.define('files', {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fileExtension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileMimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
  return files;
};
