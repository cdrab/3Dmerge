module.exports = (sequelize, DataTypes) => {
    const sessions = sequelize.define('sessions', {
        ID_session:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        day:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        month:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        year:{
            type: DataTypes.STRING,
            allowNull: false,
        },

    })
    return sessions
}