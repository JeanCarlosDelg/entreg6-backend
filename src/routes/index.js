const express = require('express');
const userRouter = require('./user.router');
const cityRouter = require('./city.router');
const hotelRouter = require('./hotel.router');
const imageRouter = require('./image.router');
const bookingRouter = require('./booking.router');
const reviewRouter = require('./review.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', userRouter)
router.use('/cities', cityRouter)
router.use('/hotels', hotelRouter)
router.use('/images', imageRouter)
router.use('/bookings', bookingRouter)
router.use('/reviews', reviewRouter)


module.exports = router;