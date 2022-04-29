const mongoCollections = require('../config/mongoCollections');
const pets = mongoCollections.pets;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const { ObjectId } = require('mongodb');
const usersData=require('./usersData');
const { users } = require('../config/mongoCollections');
const emailValidator = require("email-validator");




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

module.exports = {
 getPetDetailsByPetId,
 addPetUserFavorite
}