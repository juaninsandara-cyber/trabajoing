'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = function(models) {
    // Aquí van relaciones si las necesitas
    // por ejemplo: User.hasMany(models.Payment)
  };

  return User;
};
