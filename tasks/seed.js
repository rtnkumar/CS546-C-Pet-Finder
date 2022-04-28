const dbConnection = require('../config/mongoConnection');
const { ObjectId } = require('mongodb');
const data = require('../data');
const petTypesData = data.petTypesData;


async function populateDummyUsers(db) {
  await db.collection('users');

  const makeUser = function (firstName, middleName, lastName, email, password, phoneNumber, address, city, state, zip, picture) {
    return {
      _id: new ObjectId(),
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
      state: state,
      zip: zip,
      picture: picture
    };
  };

  // Users
  let user1 = makeUser("John", "Sean", "Doe", "jdoe@email.com", "password", "1234567890", "123 Main St", "Manhattan", "NY", "10001", "john.jpg");
  let user2 = makeUser("Sam", "Patrick", "Smith", "psmith@gmail.com", "totallysafe", "5430592111", "300 Concord Road", "RealTown", "CA", "90002", "smith.jpg");
  let user3 = makeUser("Martha", "Jane", "Meyer", "doublem@hotmail.com", "notsafe", "3125550111", "100 Washington St", "Hoboken", "NJ", "07030", "marthaMeyer.png");
  let user4 = makeUser("Jane", "Mary", "Doe", "janeisnotjohn@gmail.com", "u89ji4ucdc", "0987654321", "123 Main St", "Manhattan", "NY", "10001", "jane.jpg");

  await db.collection('users').insertMany([user1, user2, user3, user4]);
}

async function populateDummyPets(db) {
  await db.collection('pets');
  await db.collection('petTypes');
  await db.collection('users');

  const makePet = function (name, breed, age, size, gender, color, address, zip, city, state, description, picture) {
    return {
      _id: new ObjectId(),
      name: name,
      type: {
        _id: null,
        type: null
      },
      breed: breed,
      age: age,
      size: size,
      gender: gender,
      color: color,
      address: address,
      zip: zip,
      city: city,
      state: state,
      description: description,
      ownerId: null,
      picture: picture,
      createdAt: new Date(),
      updatedAt: new Date(),
      adoptedBy: null
    };
  };

  let pet1 = makePet("Spot", "Labrador", "Puppy", "Medium", "M", "Black", "123 Main St", "10001", "Manhattan", "NY", "A dog who is a Labrador.", "spot.jpg");
  pet1.type.type = "Dog";
  let petType = await db.collection('petTypes').findOne({ type: "Dog" });
  pet1.type._id = petType._id;
  let user = await db.collection('users').findOne({ firstName: "John" });
  pet1.ownerId = user._id;

  let pet2 = makePet("Stella", "Retriever", "Young", "Medium", "F", "golden", "123 Main St", "10001", "Manhattan", "NY", "Loves to play in the mud.", "stella.jpg");
  pet2.type.type = "Dog";
  petType = await db.collection('petTypes').findOne({ type: "Dog" });
  pet2.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "John" });
  pet2.ownerId = user._id;

  let pet3 = makePet("BooBear", "Siamese", "Adult", "Small", "M", "White", "100 Washington St", "07030", "Hoboken", "NJ", "The BooBear doesn't fall far from the Brandon.", "boobear.jpg");
  pet3.type.type = "Cat";
  petType = await db.collection('petTypes').findOne({ type: "Cat" });
  pet3.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Martha" });
  pet3.ownerId = user._id;

  let pet4 = makePet("Shadow", "Siamese", "Young", "Small", "M", "Black", "100 Washington St", "07030", "Hoboken", "NJ", "Shadow hops in my sink all the time.", "shadow.jpg");
  pet4.type.type = "Cat";
  petType = await db.collection('petTypes').findOne({ type: "Cat" });
  pet4.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Martha" });
  pet4.ownerId = user._id;

  let pet5 = makePet("Thumper", "Domestic", "Young", "Medium", "M", "Grey", "300 Concord Road", "90002", "RealTown", "CA", "They call him thumper!", "thumper.jpg");
  pet5.type.type = "Rabbit";
  petType = await db.collection('petTypes').findOne({ type: "Rabbit" });
  pet5.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sam" });
  pet5.ownerId = user._id;

  let pet6 = makePet("Epona", "Mustang", "Adult", "Large", "F", "Brown", "300 Concord Road", "90002", "RealTown", "CA", "Epona likes the sound of pretty music.", "epona.jpg");
  pet6.type.type = "Horse";
  petType = await db.collection('petTypes').findOne({ type: "Horse" });
  pet6.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sam" });
  pet6.ownerId = user._id;

  await db.collection('pets').insertMany([pet1, pet2, pet3, pet4, pet5, pet6]);
}

async function populateDummyQuestionsAnswers(db) {
  await db.collection('petsQuestionsAnswers');
  await db.collection('pets');
  await db.collection('users');

  const makeQuestion = function (question, answer, petId, askedBy, ownerId) {
    return {
      _id: new ObjectId(),
      question: question,
      answer: answer,
      petId: petId,
      askedBy: askedBy,
      ownerId: ownerId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  let pet = await db.collection('pets').findOne({ name: "Spot" });
  let owner = await db.collection('users').findOne({ firstName: "John" });
  let asker = await db.collection('users').findOne({ firstName: "Martha" });
  let question1 = makeQuestion("What is Spot's favorite food?", "Tuna", pet._id, asker._id, owner._id);
  let question2 = makeQuestion("What is Spot's favorite color?", "Black", pet._id, asker._id, owner._id);

  pet = await db.collection('pets').findOne({ name: "Epona" });
  owner = await db.collection('users').findOne({ firstName: "Sam" });
  asker = await db.collection('users').findOne({ firstName: "Martha" });
  let question3 = makeQuestion("What is Epona's favorite song?", "All country music!", pet._id, asker._id, owner._id);

  pet = await db.collection('pets').findOne({ name: "BooBear" });
  owner = await db.collection('users').findOne({ firstName: "Sam" });
  asker = await db.collection('users').findOne({ firstName: "John" });
  let question4 = makeQuestion("How did BooBear get his name?", "It's a rather long story", pet._id, asker._id, owner._id);

  await db.collection('petsQuestionsAnswers').insertMany([question1, question2, question3, question4]);
}

const main = async () => {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  // Populate petTypeCollection
  await petTypesData.populatePetTypeCollection();

  // Populate dummy users
  await populateDummyUsers(db);

  // Populate dummy pets
  await populateDummyPets(db);

  // Populate dummy questions and answers
  await populateDummyQuestionsAnswers(db);


  console.log('Done seeding database');
};

main().catch(console.log);