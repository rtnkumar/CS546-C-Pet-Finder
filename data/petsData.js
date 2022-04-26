const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const pets = mongoCollections.pets;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const usersData=require('./usersData');

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
    if (!(city || state || zip || petType)) throw 'No search criteria specified';

    // Validate city
    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Alphanumeric
        isValidCity = commonValidators.isValidName(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];
    }

    // Validate state
    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Alphanumeric
        isValidState = commonValidators.isValidName(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    }

    // Validate zip
    if (zip) {
        // Valid String
        let isValidZip = commonValidators.isValidString(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid Integer
        isValidZip = commonValidators.isValidInteger(zip.toString(), 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.toString().length > 5) throw 'zip is not of length 5';
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
        if (city) query.city = city.trim();
        if (state) query.state = state.trim();
        if (zip) query.zip = zip.trim();
        if (petType) query.petType = petType.trim();

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
 * @param {*} picture : A name of a picture file of the pet (Subject to change)
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
        // Valid String
        let isValidAge = commonValidators.isValidString(age, 'age');
        if (!isValidAge[0]) throw isValidAge[1];

        // Valid Integer
        isValidAge = commonValidators.isValidInteger(age, 'age');
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

        if (gender.toUpperCase() !== 'M' || gender.toUpperCase() !== 'F') throw "Gender must be male or female"
    } else throw "gender is required";

    if (color) {
        // Valid String
        let isValidColor = commonValidators.isValidString(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Valid Alphabet
        isValidColor = commonValidators.isValidAlphabet(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];
    } else throw "color is required";

    if (address) {
        // Valid String
        let isValidAddress = commonValidators.isValidString(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

        // Valid Alphabet
        isValidAddress = commonValidators.isValidAddress(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

    } else throw "address is required";

    if (zip) {
        // Valid String
        let isValidZip = commonValidators.isValidString(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid Integer
        isValidZip = commonValidators.isValidInteger(zip.toString(), 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.toString().length > 5) throw 'zip is not of length 5';
    } else throw "zip is required";

    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Nam
        isValidCity = commonValidators.isValidName(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];
    } else throw "city is required";

    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Alphanumeric
        isValidState = commonValidators.isValidName(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    } else throw "state is required";

    if (description) {
        // Valid String
        let isValidDescription = commonValidators.isValidString(description, 'description');
        if (!isValidDescription[0]) throw isValidDescription[1];
    } else throw "description is required";

    const ownerCollection = await owners();
    if (ownerId) {
        // Valid ID
        let isValidOwnerId = commonValidators.isValidId(ownerId);
        if (!isValidOwnerId) throw `${ownerId} is not a valid id`;

        // Valid Existence in owners collection
        let isValidExists = await ownerCollection.findOne({ _id: ObjectId(ownerId) });
        if (!isValidExists) throw `${ownerId} does not belong to any owner`;
    } else throw "ownerId is required";

    if (picture) {
        // Valid String
        let isValidPicture = commonValidators.isValidString(picture, 'picture');
        if (!isValidPicture[0]) throw isValidPicture[1];

        // Valid file
        isValidPicture = commonValidators.isValidFile(picture, 'picture');
        if (!isValidPicture) throw `${picture} is not a valid file`;
    } else throw "picture is required";
    
    const petsCollection = await pets();
    typeFound = await petTypes().findOne({ type: petType.trim() });

    const newPet = {
        name: name.trim(),
        type: {
            _id: typeFound._id,
            type: typeFound.type
        },
        breed: breed.trim(),
        age: age,
        size: size.trim(),
        gender: gender.trim(),
        color: color.trim(),
        address: address.trim(),
        zip: zip,
        city: city.trim(),
        state: state.trim(),
        description: description.trim(),
        ownerId: ownerId,
        picture: picture.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        adoptedBy: null
    };
    const insertInfo = await petsCollection.insertOne(newPet);
    if (insertInfo.insertedCount === 0) throw "Could not add pet";
    const newId = insertInfo.insertedId.toString();
    const pet = await petsCollection.findOne({ _id: newId });
    pet._id = newId;
    return pet;
}

// Getting pet details by pet-id
async function getPetDetailsByPetId(id){

    if(arguments.length!=1){
        throw 'Only 1 argument are required';
    }

    if(!commonValidators.isValidId(id)){
        throw 'Invalid id'
    }

    id=id.trim();
    const petsCollection = await pets();
    let petDetails=await petsCollection.findOne({ _id:ObjectId(id)});

    if (petDetails === null) {
        throw `No pet with id=${id}`;
    }
    petDetails._id = petDetails._id.toString();

   let owner=await usersData.getUserById(petDetails.ownerId);
   const petsQuestionsAnswersCollection= await petsQuestionsAnswers();
   let petsQuestionsAnswerList=await petsQuestionsAnswersCollection.find({petId:id}).toArray();
   petDetails.owner={
       id:owner._id,
       firstName:owner.firstName,
       middleName:owner.middleName,
       lastName:owner.lastName,
       email:owner.email,
       phoneNumber:owner.phoneNumber,
       address:owner.address,
       city:owner.city,
       state:owner.state,
       zip:owner.zip,
       picture:owner.picture
   };
   let qna=[];
   for(let petQuestionAnswer of petsQuestionsAnswerList){
       qna.push({
        question:petQuestionAnswer.question,
        answer:petQuestionAnswer.answer,
        createdAt:petQuestionAnswer.createdAt,
        updatedAt:petQuestionAnswer.updatedAt
       })
   }
   
   petDetails.qna=qna;

   return petDetails;

}

module.exports = {
    homePageSearch,
    createPet,
    getPetDetailsByPetId
}