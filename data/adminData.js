const mongoCollections = require('../config/mongoCollections');
const validators = require('../validators');
const emailValidator = require("email-validator");
const adminUsers =mongoCollections.adminUsers;
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const commonValidators = validators.commonValidators;
const utils = require('../utils/utils');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { getAllPetTypes } = require('./petTypesData');

async function getAllPets(){
    const petCollection = await pets();
    let petsList=await petCollection.find({}).toArray();
    let index=1;
    for(let pet of petsList){
        pet.index=index++;
        pet._id=pet._id.toString();
    }
    return petsList;
}

async function getAllUsers(){
    const usersCollection = await users();
    let usersList=await usersCollection.find({}).toArray();
    let index=1;
    for(let user of usersList){
        user.index=index++;
        user._id=user._id.toString();
    }
    return usersList;
}

/**
 * Siddarth Singh
 * Check whether admin is real or fake 
 */
 async function checkAdminUser(email, password) {

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

    const adminUsersCollection = await adminUsers();
    const adminUser = await adminUsersCollection.findOne({ email: email });
    if (!adminUser) {
        throw "Either the email or password is invalid";
    }

    password = password.trim();
    isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, adminUser.password);
    } catch (e) {
        //no op
    }

    if (isValidPassword) {
        return { authenticated: true };
    } else {
        throw "Either the email or password is invalid";
    }
}


async function getAdminUserByEmail(email) {
    // Email validation
    if (!email || email.trim() == "") {
        throw `email is required`;
    }
    if (!emailValidator.validate(email)) {
        throw `${email} is invalid email format`;
    }

    const adminUsersCollection = await adminUsers();
    return await adminUsersCollection.findOne({ email: email });
}

async function getAdminById(id){

    if(arguments.length!=1){
        throw 'Only 1 argument are required';
    }

    if(!commonValidators.isValidId(id)){
        throw 'Invalid id'
    }

    id=id.trim();
    const adminUsersCollection = await adminUsers();
    let adminUser=await adminUsersCollection.findOne({ _id:ObjectId(id)});

    if (adminUser === null) {
        throw `No user with id=${id}`;
    }
    adminUser._id = adminUser._id.toString();

    return adminUser;
}

module.exports= {
    checkAdminUser,
    getAdminUserByEmail,
    getAdminById,
    getAllPets,
    getAllUsers
}
