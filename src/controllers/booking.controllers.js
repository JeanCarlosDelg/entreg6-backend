const catchError = require('../utils/catchError');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Image = require('../models/Image');
const City = require('../models/City');
// bookings -> hotels -> city
const getAll = catchError(async(req, res) => {
    const results = await Booking.findAll({
        where: {userId: req.user.id}, 
        include: [{
            model: Hotel,
            include: [Image, City],
        },],
        // include: [Hotel]
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { checkIn, checkOut, hotelId } = req.body
    const result = await Booking.create({
        checkIn,
        checkOut,
        hotelId,
        userId: req.user.id,
      });
    return res.status(201).json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Booking.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body
    const result = await Booking.update({ 
        checkIn, 
        checkOut
    }, { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    remove,
    update
}