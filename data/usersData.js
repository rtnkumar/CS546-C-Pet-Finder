const mongoCollections = require('../config/mongoCollections');
const validators = require('../validators');
const emailValidator = require("email-validator");
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;



// 1. Create User
async function create(firstName, middleName, lastName, email, phoneNumber, password, address, city, state, zip, picture) {

const commonValidators = validators.commonValidators;
const utils = require('../utils/utils');
const bcrypt = require('bcrypt');



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
        throw 'Could not add user';



    return { userInserted: true };
}

/**
 * Roushan Kumar
 * Check whether the user is real or fake
 * 
 * @param {email of user} email 
 * @param {password of user} password 
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
 * @param {ConfirmPassword of user} confirmPassword 
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



/**
 * Feneel Doshi
 * Get email of the user
 * @param {Email of user} emailId 
 * @returns 
 */

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



/** 
*Feneel Doshi
*Retrieve the email id of user
* @param {email of user} emailId
* @returns
*/

async function getEmail(emailId){

    emailId = email.trim()
    emailId = emailId.toLowerCase()

    //Input Arguments validation
    if(arguments.length != 1)
        throw "Error: There should not be more than 1 arguments!"
    
    
    //Email validation

    if(!emailId || emailId.trim() == ""){
        throw "Error: Email cannot be empty"
    }

    if(!emailValidator.validate(emailId)){
            throw `${emailId} is not a valid email!`
    }

    const usersCollection = await users()
    const getUserEmail = await usersCollection.findOne({email: emailId});

    if(getUserEmail){
        return getUserEmail
    }

    throw {error: "No user with that email found! Please enter a valid email address."}
    
}


/**
 * Feneel Doshi
 * Update user
 * 
 * @param {First Name of user} firstName
 * @param {Middle Name of user} middleName
 * @param {Last Name of user} lastName
 * @param {Phone Number of user} phoneNumber
 * @param {Address of user} address
 * @param {City of user} city
 * @param {State of user} state
 * @param {Zip of user} zip 
 * @returns
*/

async function updateUser(firstName, middleName, lastName, phoneNumber, address, city, state, zip){

    //Input arguments validation
    if(arguments.length != 8){
        throw "Error: Arguments cannot be greater than 8"
    }

    //FirstName validation

    let validFNameString = commonValidators.isValidString(firstName, 'First Name')
    if(!validFNameString[0]){
        throw validFNameString[1]
    }

    let validFName = commonValidators.isValidName(firstName, 'First Name')
    if(!validFName[0]){
        throw validFName[1]
    }
    
    //MiddleName validation
    
    if(middleName){
        let isValidMNameString = commonValidators.isValidString(middleName, 'Middle Name')
        if(!isValidMNameString[0]){
            throw isValidMNameString[1]
        }

        let isValidMName = commonValidators.isValidName(middleName, 'Middle Name')
        if(!isValidMName[0]){
            throw isValidMName[1]
        }


    }
    //LastName validation
    let isValidLNameString = commonValidators.isValidString(lastName, 'Last Name')
    if(!isValidLNameString[0]){
        throw isValidLNameString[1]
    }

    let isValidLName = commonValidators.isValidName(lastName, 'Last Name')
    if(!isValidLName[0]){
        throw isValidLName[1]
    }
    
    //PhoneNumber validation
    if(!phoneNumber){
        throw "Error: Phone Number is required"
    }

    let isValidNumber = commonValidators.isValidPhoneNumber(phoneNumber, 'Phone Number')
    if(!isValidNumber[0]){
        throw isValidNumber[1]
    }

    //Address validation
    let isValidAddressString = commonValidators.isValidString(address, 'Address')
    if(!isValidAddressString[0]){
        throw isValidAddressString[1]
    }
    
    let isValidAddress = commonValidators.isValidAddress(address, "Address")
    if(isValidAddress[0]){
        throw isValidAddress[1]
    }

    //City validation
    let isValidCityString = commonValidators.isValidString(city, 'City')
    if(!isValidCityString[0]){
        throw isValidCityString[1]
    }

    let isValidCityName = commonValidators.isValidString(city, 'City')
    if(!isValidCityName[0]){
        throw isValidCityName[1]
    }

    //State validation
    let isValidStateString = commonValidators.isValidString(state, 'State')
    if(!isValidStateString[0]){
        throw isValidStateString[1]
    }

    let isValidState = commonValidators.isValidName(state, 'State')
    if(!isValidState[0]){
        throw isValidState[1]
    }

    //Zip validation
    let isValidZipString = commonValidators.isValidString(zip, 'Zip')
    if(!isValidZipString[0]){
        throw isValidZipString[1]
    }

    let isValidZip = commonValidators.isValidInteger(zip, 'Zip')
    if(!isValidZip[0]){
        throw isValidZip[1]
    }

    
    const usersCollection = await users();

    const updatedUserInfo = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        state: state,
        zip: zip
    }

    const updatedInfo = await usersCollection.updateOne(
        {email: email},
        { $set: updatedUserInfo}
    )

    if(updatedInfo.modifiedCount == 0){
        throw "No update made to the user profile"
    }

    let getInfo = await this.getEmail(email)
    return getInfo
}


/**
 * Feneel Doshi
 * Remove account of the user
 * @param {Email of the user} emailId 
 * @returns 
 */

async function remove(emailId){
    emailValidator.validate(emailId)
    const usersCollection = await users()
    const getUser = await usersCollection.findOne({email: emailId})

    const removeUser = await usersCollection.deleteOne({email: emailId})

    if(removeUser.deletedCount !== 1){
        throw new Error(`No user exist with that email!`)

    }
    return {deleted: true}
}


module.exports = {

    create,
    getEmail,
    updateUser, 
    remove,
    createUser,
    checkUser,
    updateUserEmailPassword

}
}