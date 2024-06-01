const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Review = sequelize.define('review', {
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    // hotelId
    // userId
});

module.exports = Review;