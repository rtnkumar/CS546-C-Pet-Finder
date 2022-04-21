const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;

/**
 * @brief Retrieves pets from the database that match the given criteria.
 * At least one of the given criteria must be specified.
 * 
 * @param {*} city : The city to search fors
 * @param {*} state : The state to search for
 * @param {*} zip : The zip to search for
 * @param {*} petType : The petType to search for
 * 
 * @return Returns an array of pets that match the given criteria.
 */
async function homePageSearch(city, state, zip, petType) {
    // Validate the input
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

        // Convert all owner id's to string
        for (i in petsToReturn) petsToReturn[i].ownerId = petsToReturn[i].ownerId.toString();
    }

    return petsToReturn;
}

/**
 * @brief Creates a new pet in the database using the given data.
 * All fields must be specified.
 * 
 * @param {*} name : The name of the pet
 * @param {*} petType : The type of the pet
 * @param {*} breed : The breed of the pet
 * @param {*} age : The age of the pet
 * @param {*} size : The size of the pet
 * @param {*} gender : The gender of the pet
 * @param {*} color : The color of the pet
 * @param {*} address : The address where the pet is located
 * @param {*} zip : The zip where the pet is located
 * @param {*} city : The city where the pet is located
 * @param {*} state : The state where the pet is located
 * @param {*} description : A description of the pet
 * @param {*} ownerId : The id of the owner of the pet
 * @param {*} picture : A link to a picture of the pet (Subject to change)
 * 
 * @return Returns an object containing all of the fields of the pet, including the id of the pet.
 */
async function createPet(name, petType, breed, age, size, gender, color, address, zip, city, state, description, ownerId, picture) {
    // Validate the input
    // Validate name
    if (name) {
        // Valid String
        let isValidName = commonValidators.isValidString(name, 'name');
        if (!isValidName[0]) throw isValidName[1];

        // Valid Alphabet
        isValidName = commonValidators.isValidAlphabet(name, 'name');
        if (!isValidName[0]) throw isValidName[1];
    } else throw "name is required";

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

    // Validate age
    if (age) {
        // Valid Number
        if (typeof age !== 'number') throw 'age is not a number';

        // Valid Integer
        let isValidAge = commonValidators.isValidInteger(age, 'age');
        if (!isValidAge[0]) throw isValidAge[1];
    } else throw "age is required";

    // Validate size
    if (size) {
        // Valid String
        let isValidSize = commonValidators.isValidString(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Valid Alphabet
        isValidSize = commonValidators.isValidAlphabet(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];
    } else throw "size is required";

    // Validate gender
    if (gender) {
        // Valid String
        let isValidGender = commonValidators.isValidString(gender, 'gender');
        if (!isValidGender[0]) throw isValidGender[1];

        // Valid Alphabet
        isValidGender = commonValidators.isValidAlphabet(gender, 'gender');
        if (!isValidGender[0]) throw isValidGender[1];

        // 
    } else throw "gender is required";

    if (color) {

    } else throw "color is required";

    if (address) {

    } else throw "address is required";

    if (zip) {

    } else throw "zip is required";

    if (city) {

    } else throw "city is required";

    if (state) {

    } else throw "state is required";

    if (description) {

    } else throw "description is required";

    if (ownerId) {

    } else throw "ownerId is required";

    if (picture) {

    } else throw "picture is required";
}



module.exports = {
    homePageSearch
}