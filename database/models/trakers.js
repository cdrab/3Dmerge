module.exports = (sequelize, DataTypes) => {
  const trakers = sequelize.define("trakers", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  trakers.associate = (models) => {
    trakers.belongsTo(models.products, {
      onDelete: "CASCADE",
      foreignKey: "productId",
    });

    trakers.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: "userId",
    });

    trakers.hasMany(models.logs, {
      onDelete: "CASCADE",
      foreignKey: "trakerId",
    })

  };

  return trakers;
};
