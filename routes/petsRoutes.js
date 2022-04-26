const express = require('express');
const petsRouter = express.Router();
const xss = require('xss');
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const trimRequest = require('trim-request');

const data = require('../data');
const petsData = data.petsData;

// Routes
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
            if (city) cityTests(city);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                city: city
            });
        }

        // Validate state
        try {
            if (state) stateTests(state);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                state: state
            });
        }

        // Validate zip
        try {
            if (zip) zipTests(zip);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                zip: zip
            });
        }

        // Validate petType
        try {
            if (type) petTypeTests(type);
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
                pets: pets
            });
        } catch (e) {
            res.status(500).json({
                error: true,
                message: e
            });
        }
    });

petsRouter

    post('/upload', trimRequest.all, async (req, res) => {
        // Validation
        let name = xss(req.body.name);
        let type = xss(req.body.type);
        let breed = xss(req.body.breed);
        let age = xss(req.body.age);
        let size = xss(req.body.size);
        let gender = xss(req.body.gender);
        let color = xss(req.body.color);
        let address = xss(req.body.address);
        let zip = xss(req.body.zip);
        let city = xss(req.body.city);
        let state = xss(req.body.state);
        let description = xss(req.body.description);
        let ownerId = xss(req.body.ownerId);
        let picture = xss(req.body.picture);

        // Validate name
        try {
            nameTests(name);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                name: name
            });
        }

        // Validate type
        try {
            typeTests(type);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                type: type
            });
        }

        // Validate breed
        try {
            breedTests(breed);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                breed: breed
            });
        }

        // Validate age
        try {
            ageTests(age);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                age: age
            });
        }

        // Validate size
        try {
            sizeTests(size);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                size: size
            });
        }

        // Validate gender
        try {
            genderTests(gender);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                size: size
            });
        }

        // Validate color
        try {
            colorTests(color);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                color: color
            });
        }

        // Validate address
        try {
            addressTests(address);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                address: address
            });
        }

        // Validate zip
        try {
            zipTests(zip);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                zip: zip
            });
        }

        // Validate city
        try {
            cityTests(city);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                city: city
            });
        }

        // Validate state
        try {
            stateTests(state);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                state: state
            });
        }

        // Validate description
        try {
            descriptionTests(description);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                description: description
            });
        }

        // Validate ownerId
        try {
            ownerIdTests(ownerId);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                ownerId: ownerId
            });
        }

        // Validate picture
        try {
            pictureTests(picture);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                picture: picture
            });
        }

        // Response
        try {
            const pet = await petsData.createPet(name, type, breed, age, size, gender, color, address, zip, city, state, description, ownerId, picture);
            pet.error = false;
            res.status(200).json(pet);
        } catch (e) {
            res.status(500).json({
                error: true,
                message: e
            });
        }
    });


// Testing functions
function stateTests(state) {
    // Validate state
    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Alphanumeric
        isValidState = commonValidators.isValidAlphaNumeric(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    } else throw "state is required";
}

function cityTests(city) {
    // Validate city
    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city);
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Alphanumeric
        isValidCity = commonValidators.isValidAlphaNumeric(city);
        if (!isValidCity[0]) throw isValidCity[1];
    } else throw "city is required";
}

function zipTests(zip) {
    if (zip) {
        // Valid Number
        if (typeof zip !== 'number') throw 'zip is not a number';

        // Valid Integer
        let isValidZip = commonValidators.isValidInteger(zip.toString(), 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.toString().length > 5) throw 'zip is not of length 5';
    } else throw "zip is required";
}

function petTypeTests(petType) {
    // Validate petType
    const petTypeCollection = await petTypes();
    if (petType) {
        // Valid String
        let isValidPetType = commonValidators.isValidString(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Alphabet
        isValidPetType = commonValidators.isValidAlphabet(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Existence in petTypes collection
        let isValidExists = await petTypeCollection.findOne({ type: petType });
        if (!isValidExists) throw `${petType} is not a valid petType`;
    } else throw "petType is required";
}

function nameTests(name) {
    // Validate name
    if (name) {
        // Valid String
        let isValidName = commonValidators.isValidString(name, 'name');
        if (!isValidName[0]) throw isValidName[1];

        // Valid Alphabet
        isValidName = commonValidators.isValidAlphabet(name, 'name');
        if (!isValidName[0]) throw isValidName[1];
    } else throw "name is required";
}

function breedTests(breed) {
    // Validate breed
    if (breed) {
        // Valid String
        let isValidBreed = commonValidators.isValidString(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

        // Valid Alphabet
        isValidBreed = commonValidators.isValidAlphabet(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

        // Check this in petTypes collection or... ?
    } else throw "breed is required";
}

function ageTests(age) {
    // Validate age
    if (age) {
        // Valid Number
        if (typeof age !== 'number') throw 'age is not a number';

        // Valid Integer
        let isValidAge = commonValidators.isValidInteger(age, 'age');
        if (!isValidAge[0]) throw isValidAge[1];
    } else throw "age is required";
}

function sizeTests(size) {
    // Validate size
    if (size) {
        // Valid String
        let isValidSize = commonValidators.isValidString(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Valid Alphabet
        isValidSize = commonValidators.isValidAlphabet(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];
    } else throw "size is required";
}

function genderTests(gender) {
    // Validate gender
    if (gender) {
        // Valid String
        let isValidGender = commonValidators.isValidString(gender, 'gender');
        if (!isValidGender[0]) throw isValidGender[1];

        if (gender.toUpperCase() !== 'M' || gender.toUpperCase() !== 'F') throw "Gender must be male or female"
    } else throw "gender is required";
}

function colorTests(color) {
    if (color) {
        // Valid String
        let isValidColor = commonValidators.isValidString(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Valid Alphabet
        isValidColor = commonValidators.isValidAlphabet(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];
    } else throw "color is required";
}

function addressTests(address) {
    if (address) {
        // Valid String
        let isValidAddress = commonValidators.isValidString(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

        // Valid Alphabet
        isValidAddress = commonValidators.isValidAlphabet(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

    } else throw "address is required";
}

function descriptionTests(description) {
    if (description) {
        // Valid String
        let isValidDescription = commonValidators.isValidString(description, 'description');
        if (!isValidDescription[0]) throw isValidDescription[1];
    } else throw "description is required";
}

function ownerIdTests(ownerId) {
    const ownerCollection = await owners();
    if (ownerId) {
        // Valid String
        let isValidOwnerId = commonValidators.isValidString(ownerId, 'ownerId');
        if (!isValidOwnerId[0]) throw isValidOwnerId[1];

        // Valid ObjectId
        if (!ObjectId.isValid(ownerId)) throw `${ownerId} is not a valid ObjectId`;

        // Valid Existence in owners collection
        let isValidExists = await ownerCollection.findOne({ _id: ObjectId(ownerId) });
        if (!isValidExists) throw `${ownerId} does not belong to any owner`;
    } else throw "ownerId is required";
}

function pictureTests(picture) {
    if (picture) {
        // Valid String
        let isValidPicture = commonValidators.isValidString(picture, 'picture');
        if (!isValidPicture[0]) throw isValidPicture[1];

        // Valid file
        isValidPicture = commonValidators.isValidFile(picture, 'picture');
        if (!isValidPicture) throw `${picture} is not a valid file`;
    } else throw "picture is required";
}


module.exports = petsRouter;