const express = require('express');
const petsRouter = express.Router();

const xss = require('xss');


const data = require('../data');
const petsData = data.petsData;


module.exports = petsRouter;