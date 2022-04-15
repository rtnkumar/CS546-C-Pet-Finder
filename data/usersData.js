const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;


// 1. Create Band
async function create(firstName, middleName, lastName, email, phoneNumber, password, address, city, state, zip, picture) {

    let newUser = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        picture: picture.trim()

    };
    const usersCollection = await users();

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add band';

    const newId = insertInfo.insertedId.toString();
    return newId;
}

module.exports = {
    create
}