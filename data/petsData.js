const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;

/**
 * Retrieves pets from the database that match the given criteria.
 * At least one of the given criteria must be specified.
 * 
 * @param {*} city : The city to search fors
 * @param {*} state : The state to search for
 * @param {*} zip : The zip to search for
 * @param {*} petType : The petType to search for
 * 
 * Returns an array of pets that match the given criteria.
 * 
 */
async function homePageSearch(city, state, zip, petType) {
    // If none of the given criteria are specified, throw an error.
    if (city === undefined && state === undefined && zip === undefined && petType === undefined) throw 'No search criteria specified';

    // Validate city
    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Alphanumeric
        isValidCity = commonValidators.isValidAlphaNumeric(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];
    }

    // Validate state
    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Alphanumeric
        isValidState = commonValidators.isValidAlphaNumeric(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    }

    // Validate zip
    if (zip) {
        // Valid Number
        if (typeof zip !== 'number') throw 'zip is not a number';

        // Valid Integer
        let isValidZip = commonValidators.isValidInteger(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];
    }

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
    }

    const petCollection = await pets();
    let petsToReturn = [];
    
    // Search through collection for pets that match criteria
    // Include pets that match any of the criteria
    if (city || state || zip || petType) {
        let query = {};
        if (city) query.city = city;
        if (state) query.state = state;
        if (zip) query.zip = zip;
        if (petType) query.petType = petType;

        // Retrieve all pets that match criteria
        petsToReturn = await petCollection.find(query).toArray();
        if (petsToReturn.length === 0) throw 'No pets found';

        // Convert all pet id's to string
        for (i in petsToReturn) petsToReturn[i]._id = petsToReturn[i]._id.toString();
    }

    return petsToReturn;
}

module.exports = {

}