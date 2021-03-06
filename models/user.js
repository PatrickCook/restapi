'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING,
      required: true
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin', 'disabled'],
      required: true
    },
    passwordHash: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true
  });
  User.associate = function(models) {
    User.hasMany(models.queue, {
      foreignKey: 'owner',
      onDelete: 'CASCADE'
    });

    User.belongsToMany(models.queue, {
      through: 'UserQueue',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
