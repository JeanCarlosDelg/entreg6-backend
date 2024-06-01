const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Hotel = sequelize.define('hotel', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    lon: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
    // cityId
});

module.exports = Hotel;