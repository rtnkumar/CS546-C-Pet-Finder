const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const usersData=require('./usersData');
const petTypesData = require('./petTypesData');
const { users } = require('../config/mongoCollections');
const emailValidator = require("email-validator");

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
    if (!(city || state || zip)) throw 'Must supply city, state or zip';
    if (!petType) throw 'Must supply petType';
    
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
        isValidZip = commonValidators.isValidInteger(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.length > 5) throw 'zip is not of length 5';
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
        let petTypeObject = await petTypeCollection.findOne({ type: petType });

        let query = {};
        if (city) query.city = city.trim();
        if (state) query.state = state.trim();
        if (zip) query.zip = zip.trim();
        if (petTypeObject) query.type = {
            _id: petTypeObject._id,
            type: petTypeObject.type
        };

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
    const petTypeCollection = await petTypesData.getAllPetTypes();
    let petTypeDocument=null;
    if (petType) {
        // Valid String
        let isValidPetType = commonValidators.isValidString(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Alphabet
        isValidPetType = commonValidators.isValidAlphabet(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Existence in petTypes collection
        petTypeDocument = getPetTypeDocumentByPetType(petTypeCollection,petType);
        if (!petTypeDocument) throw `${petType} is not a valid petType`;

    } else throw "petType is required";

    // Validate breed
    if (breed) {
        // Valid String
        let isValidBreed = commonValidators.isValidString(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

        // Valid Alphabet
        isValidBreed = commonValidators.isValidAlphabet(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

         // Valid Existence in petTypes collection
         if(!petTypeDocument.breed || !petTypeDocument.breed.includes(breed))
          throw `${breed} is not a valid breed for ${petType}`;
 

        // Check this in petTypes collection or... ?
    } else throw "breed is required";

    // Validate age
    if (age) {
        // Valid String
        let isValidAge = commonValidators.isValidString(age, 'age');
        if (!isValidAge[0]) throw isValidAge[1];

    
        // Valid Existence in petTypes collection
        if(!petTypeDocument.age || !petTypeDocument.age.includes(age))
        throw `${age} is not a valid age for ${petType}`;
    } else throw "age is required";

    // Validate size
    if (size) {
        // Valid String
        let isValidSize = commonValidators.isValidString(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Valid Alphabet
        isValidSize = commonValidators.isValidAlphabet(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Valid Existence in petTypes collection
        if(!petTypeDocument.size || !petTypeDocument.size.includes(size))
        throw `${size} is not a valid size for ${petType}`;
    } else throw "size is required";

    // Validate gender
    if (gender) {
        // Valid String
        let isValidGender = commonValidators.isValidString(gender, 'gender');
        if (!isValidGender[0]) throw isValidGender[1];

        if (gender.toUpperCase() !== 'M' && gender.toUpperCase() !== 'F') throw "Gender must be male or female"
    } else throw "gender is required";

    if (color) {
        // Valid String
        let isValidColor = commonValidators.isValidString(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Valid Alphabet
        isValidColor = commonValidators.isValidAlphabet(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Valid Existence in petTypes collection
        if(!petTypeDocument.color || !petTypeDocument.color.includes(color))
        throw `${color} is not a valid color for ${petType}`;
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
        isValidZip = commonValidators.isValidInteger(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.length > 5) throw 'zip is not of length 5';
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

    const ownerCollection = await users();
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
    } else throw "picture is required";

    const petsCollection = await pets();
    // petTypeDocument._id=petTypeDocument._id.toString();
    const newPet = {
        name: name.trim(),
        type: {
            _id: ObjectId(petTypeDocument._id),
            type: petTypeDocument.type
        },
        breed: breed.trim(),
        age: age.trim(),
        size: size.trim(),
        gender: gender.trim(),
        color: color.trim(),
        address: address.trim(),
        zip: zip.trim(),
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
    if (insertInfo.insertedCount === 0) throw "Could not add pet";console.log()
    const pet = await petsCollection.findOne({ _id: ObjectId(insertInfo.insertedId.toString()) });
    pet._id = pet._id.toString();
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

/**
 * Roushan Kumar
 * Adding pet id to user favorite list
 * 
 * @param {id of pet} id 
 * @returns 
 */
async function addPetUserFavorite(id,email){

    if(arguments.length!=2){
        throw 'Only 2 argument are required';
    }

    if(!commonValidators.isValidId(id)){
        throw 'Invalid id'
    }

     // Email validation
     if (!email || email.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email format`;
    }

    id=id.trim();
    email=email.trim().toLowerCase();
    const petsCollection = await pets();
    let petDetails=await petsCollection.findOne({ _id:ObjectId(id)});

    if (petDetails === null) {
        throw `No pet with id=${id}`;
    }

    const usersCollection= await users();
    const user=await usersCollection.findOne({email:email});
    if(user.favoriteList.includes(id)){
         throw `${id} is already in favorite list`;
    }
    const updatedInfo = await usersCollection.updateOne(
        { email: email },
        { $push: {favoriteList:id} }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update favorite list successfully';
    }

    return { favoritePetInserted: true };

}

async function addQNA(question,petId,ownerId,askedBy){
    if(arguments.length!=4){
        throw 'Only 4 argument are required';
    }

    // Question validation
    let isQuestion = commonValidators.isValidString(question, 'question');
    if (!isQuestion[0]) {
        throw isQuestion[1];
    }

    // Validation of petId
    if(!commonValidators.isValidId(petId)){
        throw 'Invalid petId'
    }

    // Validation of ownerId
    if(!commonValidators.isValidId(ownerId)){
        throw 'Invalid ownerId'
    }

    // Email validation
    if (!askedBy || askedBy.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(askedBy)) {
        throw `${askedBy} is invalid email format`;
    }

    question=question.trim();
    petId=petId.trim();
    ownerId=ownerId.trim();

    const petsCollection = await pets();
    let petDetails=await petsCollection.findOne({ _id:ObjectId(petId)});

    if (petDetails === null) {
        throw `No pet with petId=${petId}`;
    }

    const usersCollection= await users();
    const owner=await usersCollection.findOne({_id:ObjectId(ownerId)});
    if(owner===null){
        throw `No user with ownerId=${ownerId}`;
    }

    const askedByUser=await usersCollection.findOne({email:askedBy});
    let newQuestion = {
        question:question,
        answer:null,
        petId:petId,
        askedBy:askedByUser._id.toString(),
        ownerId:ownerId,
        createdAt:Date(),
        updatedAt:Date()
    };

    const petQuestionAnswersCollection = await petsQuestionsAnswers();
    const insertInfo = await petQuestionAnswersCollection.insertOne(newQuestion);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add question';

    return { question: question.trim() };

}

function getPetTypeDocumentByPetType(petTypeCollection,petType){

    for(let petDocument of petTypeCollection){
        if(petDocument.type===petType){
            return petDocument;
        }
    }
    return null;

}



/**
 * Feneel Doshi
 * Assigns the pet to the user
 * @param {Id of the pet} petId 
 * @returns 
 */

 async function assignPet(userId, petId) {

    if (arguments.length != 2) {
        throw 'Only 2 argument are required';
    }

    if (!commonValidators.isValidId(userId)) {
        throw 'Invalid userId'
    }
    if (!commonValidators.isValidId(petId)) {
        throw 'Invalid petId'
    }

    userId = userId.trim();
    petId = petId.trim();

    const petsCollection = await pets();
    let petDetails = await petsCollection.findOne({ _id: ObjectId(petId)});

    if (petDetails === null) {
        throw `No pet with id=${petId}`;

    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: ObjectId(userId) });
    if (user === null) {
        throw `No user with id=${userId}`
    }

    if (user.adoptedList.includes(petId)) {
        throw `${petId} is already in adopted list`;
    }

    const updatedInfo = await usersCollection.updateOne(
        { _id: ObjectId(userId) },
        { $push: { adoptedList: petId } }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update adopted list successfully';
    }

    return { adoptedPetInserted: true };
}
module.exports = {
    homePageSearch,
    createPet,
    getPetDetailsByPetId,
    addPetUserFavorite,
    addQNA,
    assignPet
}