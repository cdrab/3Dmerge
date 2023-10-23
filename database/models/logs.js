module.exports = (sequelize, DataTypes) => {
  const logs = sequelize.define("logs", {
    ID_Log: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    unRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trakerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  logs.associate = (models) => {
    logs.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: "userId",
    });
    logs.belongsTo(models.trakers, {
      onDelete: "CASCADE",
      foreignKey: "trakerId",
    });
  };

  return logs;
};
