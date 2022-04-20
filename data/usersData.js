const mongoCollections = require('../config/mongoCollections');
const validators = require('../validators');
const emailValidator = require("email-validator");
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const commonValidators = validators.commonValidators;
const utils = require('../utils/utils');


// 1. Create User
async function createUser(firstName, middleName, lastName, email, phoneNumber, password, address, city, state, zip, picture) {
    if (arguments.length != 11) {
        throw 'Only 11 arguments are required';
    }

    // FirstName string validation
    let isValidFirstName = commonValidators.isValidString(firstName, 'firstName');
    if (!isValidFirstName[0]) {
        throw isValidFirstName[1];
    }

    // FirstName alphabet validation
    isValidFirstName = commonValidators.isValidAlphabet(firstName, 'firstName');
    if (!isValidFirstName[0]) {
        throw isValidFirstName[1];
    }

    // MiddleName validation
    if (middleName) {
        let isValidMiddleName = commonValidators.isValidString(middleName, 'middleName');
        if (!isValidMiddleName[0]) {
            throw isValidMiddleName[1];
        }

        isValidMiddleName = commonValidators.isValidAlphabet(middleName, 'middleName');
        if (!isValidMiddleName[0]) {
            throw isValidMiddleName[1];
        }
    }

    // LastName string validation
    let isValidLastName = commonValidators.isValidString(lastName, 'lastName');
    if (!isValidLastName[0]) {
        throw isValidLastName[1];
    }

    // LastName alphabet validation
    isValidLastName = commonValidators.isValidAlphabet(lastName, 'lastName');
    if (!isValidLastName[0]) {
        throw isValidLastName[1];
    }

    // Email validation
    if (!email) {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email`;
    }

    // PhoneNumber validation
    if (!phoneNumber) {
        throw 'phoneNumber is required';
    }
    let isValidPhoneNumber = commonValidators.isValidPhoneNumber(phoneNumber, 'phoneNumber');
    if (!isValidPhoneNumber[0]) {
        throw isValidPhoneNumber[1];
    }

    // Password validation
    let isValidPassword = commonValidators.isValidString(password, 'password');
    if (!isValidPassword[0]) {
        throw isValidPassword[1];
    }

    if (password.length < 6) {
        throw 'password should have at least 6 characters'
    }

    // Address string validation
    let isValidAddress = commonValidators.isValidString(address, 'address');
    if (!isValidAddress[0]) {
        throw isValidAddress[1];
    }

    // City string validation
    let isValidCity = commonValidators.isValidString(city, 'city');
    if (!isValidCity[0]) {
        throw isValidCity[1];
    }

    // State string validation
    let isValidState = commonValidators.isValidString(state, 'state');
    if (!isValidState[0]) {
        throw isValidState[1];
    }

    // Zip string validation
    let isValidZip = commonValidators.isValidString(zip, 'zip');
    if (!isValidZip[0]) {
        throw isValidZip[1];
    }

    isValidZip = commonValidators.isValidInteger(zip, 'zip');
    if (!isValidZip[0]) {
        throw isValidZip[1];
    }

    email=email.trim();
    let user=await getUserByEmail(email);
    if(user){
        throw `This ${email} is already exist, please use another`
    }

    let newUser = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: email,
        phoneNumber: phoneNumber.trim(),
        password: await utils.getHashedPassword(password.trim()),
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

    return await getUserByEmail(email);
}

async function getUserByEmail(email) {
    // Email validation
    if (!email) {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email`;
    }

    const usersCollection = await users();
    return await usersCollection.findOne({ email: email });
}

module.exports = {
    createUser
}