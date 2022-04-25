const mongoCollections = require('../config/mongoCollections');
const petTypes = mongoCollections.petTypes;


// Get all types of pet
async function getAllPetTypes() {
    const petsCollection = await petTypes();

    let petList=[];
     petList = await petsCollection.find({}).toArray();

    for (let pet of petList) {
        pet._id = pet._id.toString();
    }
    return petList;
}

module.exports={
    getAllPetTypes
}