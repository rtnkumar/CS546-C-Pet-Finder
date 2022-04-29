const mongoCollections = require('../config/mongoCollections');
const pets = mongoCollections.pets;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const { ObjectId } = require('mongodb');
const usersData = require('./usersData');
const { users } = require('../config/mongoCollections');
const { use } = require('../routes/petsRoutes');





// Getting pet details by pet-id
async function getPetDetailsByPetId(id) {

    if (arguments.length != 1) {
        throw 'Only 1 argument are required';
    }

    if (!commonValidators.isValidId(id)) {
        throw 'Invalid id'
    }

    id = id.trim();
    const petsCollection = await pets();
    let petDetails = await petsCollection.findOne({ _id: ObjectId(id) });

    if (petDetails === null) {
        throw `No pet with id=${id}`;
    }
    petDetails._id = petDetails._id.toString();

    let owner = await usersData.getUserById(petDetails.ownerId);
    const petsQuestionsAnswersCollection = await petsQuestionsAnswers();
    let petsQuestionsAnswerList = await petsQuestionsAnswersCollection.find({ petId: id }).toArray();
    petDetails.owner = {
        id: owner._id,
        firstName: owner.firstName,
        middleName: owner.middleName,
        lastName: owner.lastName,
        email: owner.email,
        phoneNumber: owner.phoneNumber,
        address: owner.address,
        city: owner.city,
        state: owner.state,
        zip: owner.zip,
        picture: owner.picture
    };
    let qna = [];
    for (let petQuestionAnswer of petsQuestionsAnswerList) {
        qna.push({
            question: petQuestionAnswer.question,
            answer: petQuestionAnswer.answer,
            createdAt: petQuestionAnswer.createdAt,
            updatedAt: petQuestionAnswer.updatedAt
        })
    }

    petDetails.qna = qna;

    return petDetails;

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
    getPetDetailsByPetId,
    assignPet
}