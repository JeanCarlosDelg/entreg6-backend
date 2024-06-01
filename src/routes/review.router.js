const { getAll, create, getOne, remove, update } = require('../controllers/review.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const reviewRouter = express.Router();

reviewRouter.route('/')
    .get(verifyJWT, getAll)
    .post(verifyJWT, create);

reviewRouter.route('/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = reviewRouter;