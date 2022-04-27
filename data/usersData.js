const mongoCollections = require('../config/mongoCollections');
const validators = require('../validators');
const emailValidator = require("email-validator");
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const commonValidators = validators.commonValidators;
const utils = require('../utils/utils');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');




/**
 * Roushan Kumar
 * Create New User
 * @param {first name of user} firstName 
 * @param {middleName name of user} middleName 
 * @param {lastName of user} lastName 
 * @param {email of user} email 
 * @param {phoneNumber of user} phoneNumber 
 * @param {password of user} password 
 * @param {address of user} address 
 * @param {city of user} city 
 * @param {state of user} state 
 * @param {zip of user} zip 
 * @param {picture name of user} picture 
 * @returns 
 */
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
    isValidFirstName = commonValidators.isValidName(firstName, 'firstName');
    if (!isValidFirstName[0]) {
        throw isValidFirstName[1];
    }

    // MiddleName validation
    if (middleName) {
        let isValidMiddleName = commonValidators.isValidString(middleName, 'middleName');
        if (!isValidMiddleName[0]) {
            throw isValidMiddleName[1];
        }

        isValidMiddleName = commonValidators.isValidName(middleName, 'middleName');
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
    isValidLastName = commonValidators.isValidName(lastName, 'lastName');
    if (!isValidLastName[0]) {
        throw isValidLastName[1];
    }

    // Email validation
    if (!email || email.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email format`;
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

    isValidAddress = commonValidators.isValidAddress(address, 'address');
    if (!isValidAddress[0]) {
        throw isValidAddress[1];
    }

    // City string validation
    let isValidCity = commonValidators.isValidString(city, 'city');
    if (!isValidCity[0]) {
        throw isValidCity[1];
    }

    isValidCity = commonValidators.isValidName(city, 'city');
    if (!isValidCity[0]) {
        throw isValidCity[1];
    }


    // State string validation
    let isValidState = commonValidators.isValidString(state, 'state');
    if (!isValidState[0]) {
        throw isValidState[1];
    }

    isValidState = commonValidators.isValidName(state, 'state');
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

    email = email.trim();
    email = email.toLowerCase();

    let user = await getUserByEmail(email);
    if (user) {
        throw `${email} is already exist, please use another`
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
        throw 'Could not add user';

    return { userInserted: true };
}

/**
 * Roushan Kumar
 * Check whether the user is real or fake
 * 
 * @param {email of user} email 
 * @param {passwor of user} password 
 * @returns 
 */
async function checkUser(email, password) {

    if (arguments.length !== 2) {
        throw "Only two arguments are required";
    }

    // Email validation
    if (!email || email.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email format`;
    }
    email = email.trim();
    email = email.toLowerCase();

    // Password validation
    let isValidPassword = commonValidators.isValidString(password, 'password');
    if (!isValidPassword[0]) {
        throw isValidPassword[1];
    }

    if (password.length < 6) {
        throw 'password should have at least 6 characters'
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
        throw "Either the email or password is invalid";
    }

    password = password.trim();
    isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, user.password);
    } catch (e) {
        //no op
    }

    if (isValidPassword) {
        return { authenticated: true };
    } else {
        throw "Either the email or password is invalid";
    }
}

/**
 * Roushan Kumar
 * Update user email & Password
 * 
 * @param {Email of user} email 
 * @param {NewEmail of user} newEmail 
 * @param {NewPassword of user} newPassword 
 * @param {ConfirmPasswor of user} confirmPassword 
 * @returns 
 */
async function updateUserEmailPassword(email, newEmail, newPassword, confirmPassword) {
    if (arguments.length !== 4) {
        throw "Only four arguments are required";
    }

    // Email validation
    if (!email || email.trim() == "") {
        throw `email is required`;
    }

    if (!emailValidator.validate(email)) {
        `${email} is invalid email format`;
    }

    let isEmailUpdate = false;
    if (newEmail) {
        isEmailUpdate = true;
        // NewEmail validation
        if (email.trim() == "") {
            throw `newEmail is required`;
        }

        if (!emailValidator.validate(newEmail)) {
            throw `${newEmail} is invalid email format`;
        }
    }


    if (!isEmailUpdate) {
        // newPassword validation
        let isValidPassword = commonValidators.isValidString(newPassword, 'newPassword');
        if (!isValidPassword[0]) {
            return isValidPassword[1];
        }

        if (newPassword.length < 6) {
            return 'password should have at least 6 characters';
        }

        // confirmPassword validation
        isValidPassword = commonValidators.isValidString(confirmPassword, 'confirmPassword');
        if (!isValidPassword[0]) {
            return isValidPassword[1];
        }

        if (confirmPassword.length < 6) {
            return 'password should have at least 6 characters';
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            return "newPassword doesn't match with confirmPassword";
        }
    }

    email = email.trim();
    email = email.toLowerCase();
    newEmail = newEmail.trim();
    newEmail = newEmail.toLowerCase();

    let password = newPassword.trim();
    const usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
        throw "Email doesn't exist";
    }

    let updatedInfo = null;
    if (typeof isEmailUpdate == 'boolean' && isEmailUpdate == true) {
        updatedInfo = await usersCollection.updateOne({ email: email }, { $set: { email: newEmail } });
    } else {
        password = await utils.getHashedPassword(password.trim()),
            updatedInfo = await usersCollection.updateOne({ email: email }, { $set: { password: password } });
    }

    if (!updatedInfo || updatedInfo.modifiedCount === 0) {
        throw 'could not update band successfully';
    }
    return { isUpdated: true };
}

async function getUserByEmail(email) {
    // Email validation
    if (!email || email.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email format`;
    }

    const usersCollection = await users();
    return await usersCollection.findOne({ email: email });
}

async function getUserById(id){

    if(arguments.length!=1){
        throw 'Only 1 argument are required';
    }

    if(!commonValidators.isValidId(id)){
        throw 'Invalid id'
    }

    id=id.trim();
    const usersCollection = await users();
    let user=await usersCollection.findOne({ _id:ObjectId(id)});

    if (user === null) {
        throw `No user with id=${id}`;
    }
    user._id = user._id.toString();

    return user;
}

module.exports = {
    createUser,
    checkUser,
    updateUserEmailPassword,
    getUserById
}