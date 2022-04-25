const mongoCollections = require('../config/mongoCollections');
const pets = mongoCollections.pets;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const { ObjectId } = require('mongodb');
const usersData=require('./usersData');




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
 getPetDetailsByPetId
}