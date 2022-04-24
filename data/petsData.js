const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const pets = mongoCollections.pets;
const petTypes = mongoCollections.petTypes;
const petsQuestionsAnswers = mongoCollections.petsQuestionsAnswers;


/**
 * Feneel Doshi
 * Assigns the pet to the user
 * @param {Id of the pet} petId 
 * @returns 
 */

async function assignPet(petId){
   
   
   
    const petCollections = await pets()

    const petInfo = {
        _id: new ObjectId(),
      
    }

    const assignPet = await petCollections.updateOne({_id: ObjectId(petId)})

    const getadoptionInfo = await petCollections.find({_id: ObjectId(petId)})
    return getadoptionInfo[0]
}   

module.exports = {
    assignPet

}