const { getData } = require('../controller/getData.controller');

const dataRouter = require('express').Router();


dataRouter.get('/get-data', getData)

module.exports = dataRouter;