const mongoCollections = require('../config/mongoCollections');
const petTypes = mongoCollections.petTypes;
const { ObjectId } = require('mongodb');


/**
 * Fills the petTypes collection with data.
 * Schema for the petType is as follows:
 * {
 *    _id: ObjectId,
 *    type: string,
 *    breed:[strings],
 *    age: [strings],
 *    size: [strings],
 *    color: [strings],
 * }
 */
async function populatePetTypeCollection() {
    const petsCollection = await petTypes();
    let petList = [];

    const makePet = function (type) {
        return {
            _id: new ObjectId(),
            type: type,
            breed: [],
            age: [],
            size: [],
            color: []
        };
    };

    // Dog
    let dog = makePet("Dog");
    dog.breed.push("Labrador", "Poodle", "Pug", "Retriever", "Shepherd");
    dog.age.push("Puppy", "Young", "Adult", "Senior");
    dog.size.push("Small", "Medium", "Large", "Extra-Large");
    dog.color.push("Black", "White", "Brown", "Grey", "Yellow");

    // Cat
    let cat = makePet("Cat");
    cat.breed.push("Persian", "Siamese", "Ragdoll", "Maine", "Bengal");
    cat.age.push("Kitten", "Young", "Adult", "Senior");
    cat.size.push("Small", "Medium", "Large", "Extra-Large");
    cat.color.push("Black", "White", "Brown", "Grey", "Yellow");

    // Horse
    let horse = makePet("Horse");
    horse.breed.push("Arabian", "Mustang", "Appaloosa");
    horse.age.push("Foal", "Young", "Adult", "Senior");
    horse.size.push("Small", "Medium", "Large", "Extra-Large");
    horse.color.push("Black", "White", "Brown", "Grey", "Yellow");

    // Rabbit
    let rabbit = makePet("Rabbit");
    rabbit.breed.push("Cottontail", "Dutch", "Domestic");
    rabbit.age.push("Baby", "Young", "Adult", "Senior");
    rabbit.size.push("Small", "Medium", "Large", "Extra-Large");
    rabbit.color.push("Black", "White", "Brown", "Grey", "Yellow");

    petList.push(dog, cat, horse, rabbit);
    await petsCollection.insertMany(petList);

    return { populate : true };
}

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
    populatePetTypeCollection,
    getAllPetTypes
}