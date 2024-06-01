const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Image = sequelize.define('image', {
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    // hotelId
});

module.exports = Image;