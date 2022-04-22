const express = require('express');
const petsRouter = express.Router();
const xss = require('xss');
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const trimRequest = require('trim-request');

const data = require('../data');
const petsData = data.petsData;

function stateTests(state, string) {
    // Validate state
    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Alphanumeric
        isValidState = commonValidators.isValidAlphaNumeric(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    }
}

function cityTests(city, string) {
    // Validate city
    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Alphanumeric
        isValidCity = commonValidators.isValidAlphaNumeric(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];
    }
}

function zipTests(zip, string) {
    // Valid Number
    if (typeof zip !== 'number') throw 'zip is not a number';

    // Valid Integer
    let isValidZip = commonValidators.isValidInteger(zip.toString(), 'zip');
    if (!isValidZip[0]) throw isValidZip[1];

    // Valid length
    if (zip.toString().length > 5) throw 'zip is not of length 5';
}

function petTypeTests(petType, string) {
    // Validate petType
    const petTypeCollection = await petTypes();
    if (petType) {
        // Valid String
        let isValidPetType = commonValidators.isValidString(petType, string);
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Alphabet
        isValidPetType = commonValidators.isValidAlphabet(petType, string);
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Existence in petTypes collection
        let isValidExists = await petTypeCollection.findOne({ type: petType });
        if (!isValidExists) throw `${petType} is not a valid petType`;
    }
}

petsRouter
    // Route to perform the homePageSearch
    // Example route with query params: pets/search-home/?city=${city_term}&state=${state_term}&zip=${zip_term}&type=${type_term} 
    .get('/search-home', trimRequest.all, async (req, res) => {
        // Validation
        let city = xss(req.query.city);
        let state = xss(req.query.state);
        let zip = xss(req.query.zip);
        let type = xss(req.query.type);

        // If no query params, return an error
        if (!city && !state && !zip && !type) {
            return res.status(400).json({
                error: true,
                message: 'No query params given'
            });
        }

        // Validate city
        try {
            cityTests(city, 'city');
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                city: city
            });
        }

        // Validate state
        try {
            stateTests(state, 'state');
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                state: state
            });
        }

        // Validate zip
        try {
            zipTests(zip, 'zip');
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                zip: zip
            });
        }

        // Validate petType
        try {
            petTypeTests(type, 'petType');
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                type: type
            });
        }

        // Response
        try {
            const pets = await petsData.homePageSearch(city, state, zip, type);
            res.status(200).json({
                error: false,
                pets
            });
        } catch (e) {
            res.status(500).json({
                error: true,
                message: e
            });
        }
    });


module.exports = petsRouter;