const Booking = require("./Booking");
const City = require("./City");
const Hotel = require("./Hotel");
const Image = require("./Image");
const Review = require("./Review");
const User = require("./User");



City.hasMany(Hotel)
Hotel.belongsTo(City)

Hotel.hasMany(Image)
Image.belongsTo(Hotel)

Hotel.hasMany(Booking)
Booking.belongsTo(Hotel)

User.hasMany(Booking)
Booking.belongsTo(User)

Hotel.hasMany(Review)
Review.belongsTo(Hotel)

User.hasMany(Review)
Review.belongsTo(User)