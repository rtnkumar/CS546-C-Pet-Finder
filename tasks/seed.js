const dbConnection = require('../config/mongoConnection');
const { ObjectId } = require('mongodb');
const data = require('../data');
const petTypesData = data.petTypesData;
const utils = require('../utils/utils');


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
      picture: picture,
      favoriteList: [],
      adoptedList: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  // Users
  let user1 = makeUser("John", "Sean", "Doe", "jdoe@email.com", await utils.getHashedPassword("password"), "123-456-7890", "123 Main St", "Manhattan", "NY", "10001", "user1.jpg");
  let user2 = makeUser("Sam", "Patrick", "Smith", "psmith@gmail.com", await utils.getHashedPassword("totallysafe"), "543-059-2111", "300 Concord Road", "RealTown", "CA", "90002", "user2.jpg");
  let user3 = makeUser("Martha", "Jane", "Meyer", "doublem@hotmail.com", await utils.getHashedPassword("notsafe"), "312-5550-111", "100 Washington St", "Hoboken", "NJ", "07030", "user3.jpg");
  let user4 = makeUser("Jane", "Mary", "Doe", "janeisnotjohn@gmail.com", await utils.getHashedPassword("u89ji4ucdc"), "098-765-4321", "123 Main St", "Manhattan", "NY", "10001", "user4.jpg");
  let user5 = makeUser("Dorothy", "", "Bubbles", "bubblemail@stevens.edu", await utils.getHashedPassword("bubbles"), "551-573-0573", "570 Water Drive", "Murrells Inlet", "South Carolina", "29573", "user5.jpg");
  let user6 = makeUser("Peter", "", "Trautman", "ptraut@doctors.md", await utils.getHashedPassword("trout_fish"), "936-501-8400", "39 West Vale Street", "Santa Clara", "California", "95050", "user6.jpg");
  let user7 = makeUser("Paul", "", "Bunyan", "wherethefoodisgood@icloud.com", await utils.getHashedPassword("paaaauuuulbunyan500!!"), "947-582-1111", "23 East Wall Ave.", "Port Richey", "Florida", "34668", "user7.jpg");
  let user8 = makeUser("Tim", "", "Horton", "heardawho@gmail.com", await utils.getHashedPassword("allTheWho'sInWhoville#50'"), "018-493-0566", "619 Livingston Ave.", "Key West", "Florida", "33040", "user8.jpg");
  let user9 = makeUser("Sydney", "", "Crawford", "crazycatlady@icloud.com", await utils.getHashedPassword("c@1sG@10Re"), "246-801-3579", "30 Monroe Rd.", "Fort Mill", "South Carolina", "29708", "user9.jpg");
  let user10 = makeUser("Dana", "", "Baker", "prettygirlxoxo@stevens.edu", await utils.getHashedPassword("try_and_hack_me_hackerzzz;D"), "086-429-7531", "36 East Rose St.", "Rolling Meadows", "Illinois", "60008", "user10.jpg");
  let user11 = makeUser("Mariam", "", "Gibson", "mariamgib@hotmail.com", await utils.getHashedPassword("chromeDidn'tMakeMeAGoodPassword"), "777-666-5454", "12 East Wall Ave.", "Port Richey", "Florida", "34668", "user11.jpg");
  let user12 = makeUser("Sophia", "Rose", "Meyer", "therose@gmail.com", await utils.getHashedPassword("1_L0V3_P13"), "323-232-3232", "67 Amherst St.", "Oakland Gardens", "New York", "11364", "user12.jpg");
  let user13 = makeUser("Michael", "", "Smith", "anothersmith@gmail.com", await utils.getHashedPassword("definitelysafe"), "111-000-1010", "7222 Bayberry Street", "Miami Beach", "Florida", "33139", "user13.jpg");
  let user14 = makeUser("Methuselah", "Oldman", "Abradolf", "oldestmanalive@notreally.org", await utils.getHashedPassword("old_older_oldest_999999999"), "483-264-7894", "38 2nd St.", "Valley Stream", "New York", "11580", "user14.jpg");
  let user15 = makeUser("Samantha", "", "Reichenthal", "artandlove@artistry.com", await utils.getHashedPassword("art_and_love"), "865-868-4433", "459 Mayfield Drive", "Danville", "Virginia", "24540", "user15.jpg");
  let user16 = makeUser("Roushan", "", "Kumar", "rkumar@stevens.edu", await utils.getHashedPassword("roushan_did_most_of_the_work"), "917-867-5309", "7533 Old Windsor St.", "Roslindale", "Massachusetts", "02131", "user16.jpg");
  let user17 = makeUser("Feneel", "", "Doshi", "fdoshi@stevens.edu", await utils.getHashedPassword("feneel_is_the_best"), "583-867-5309", "9704 Durham Street", "Reading", "Massachusetts", "01867", "user17.jpg");
  let user18 = makeUser("Dominick", "Patrick", "Varano", "dvarano@stevens.edu", await utils.getHashedPassword("dom_made_all_this_test_data"), "777-777-8888", "18 E. Prairie Drive", "Sacramento", "California", "95820", "user18.png");
  let user19 = makeUser("Siddarth", "", "Singh", "ssingh@stevens.edu", await utils.getHashedPassword("siddarth_might_be_dead_right_now?"), "333-666-7777", "1 Young Street", "Mason", "Ohio", "45040", "user19.jpeg");
  let user20 = makeUser("Patrick", "", "Hill", "phill@stevens.edu", await utils.getHashedPassword("patrick_is_a_fantastic_professor"), "056-204-8205", "431 Mill Lane", "Tuckerton", "New Jersey", "08087", "user20.jpg");


  await db.collection('users').insertMany([user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12, user13, user14, user15, user16, user17, user18, user19, user20]);
} 

async function populateAdoptedByPets(db) {
  await db.collection('pets');
  await db.collection('users');

  let pet1 = await db.collection('pets').findOne({name: "Cinnabun"});
  let pet2 = await db.collection('pets').findOne({name: "Lilly"});
  let pet3 = await db.collection('pets').findOne({name: "BooBear"});
  let pet4 = await db.collection('pets').findOne({name: "Oliver"});
  let pet5 = await db.collection('pets').findOne({name: "Luna"});
  let pet6 = await db.collection('pets').findOne({name: "Coco"});

  let user1 = await db.collection('users').findOne({firstName: "John"});
  let user2 = await db.collection('users').findOne({firstName: "Michael"});
  let user3 = await db.collection('users').findOne({firstName: "Sydney"});
  let user4 = await db.collection('users').findOne({firstName: "Dorothy"});

  // Set pet1's and pet2's adoptedBy field to the user1's _id
  await db.collection('pets').updateOne({_id: pet1._id}, {$set: {adoptedBy: user1._id}});
  await db.collection('users').updateOne({_id: user1._id}, {$push: {adoptedList: pet1._id}});
  await db.collection('pets').updateOne({_id: pet2._id}, {$set: {adoptedBy: user1._id}});
  await db.collection('users').updateOne({_id: user1._id}, {$push: {adoptedList: pet2._id}});

  // Set pet3's and pet4's adoptedBy field to the user2's _id
  await db.collection('pets').updateOne({_id: pet3._id}, {$set: {adoptedBy: user2._id}});
  await db.collection('users').updateOne({_id: user2._id}, {$push: {adoptedList: pet3._id}});
  await db.collection('pets').updateOne({_id: pet4._id}, {$set: {adoptedBy: user2._id}});
  await db.collection('users').updateOne({_id: user2._id}, {$push: {adoptedList: pet4._id}});

  // Set pet5's adoptedBy field to the user3's _id
  await db.collection('pets').updateOne({_id: pet5._id}, {$set: {adoptedBy: user3._id}});
  await db.collection('users').updateOne({_id: user3._id}, {$push: {adoptedList: pet5._id}});

  // Set pet6's adoptedBy field to the user4's _id
  await db.collection('pets').updateOne({_id: pet6._id}, {$set: {adoptedBy: user4._id}});
  await db.collection('users').updateOne({_id: user4._id}, {$push: {adoptedList: pet6._id}});
}

async function populateUserFavoriteLists(db) {
  await db.collection('pets');
  await db.collection('users');

  let pet1 = await db.collection('pets').findOne({name: "Bella"});
  let pet2 = await db.collection('pets').findOne({name: "Max"});
  let pet3 = await db.collection('pets').findOne({name: "Lady"});
  let pet4 = await db.collection('pets').findOne({name: "Cash"});
  let pet5 = await db.collection('pets').findOne({name: "Simba"});
  let pet6 = await db.collection('pets').findOne({name: "Luna"});
  let pet7 = await db.collection('pets').findOne({name: "Charlie"});
  let pet8 = await db.collection('pets').findOne({name: "Buddy"});
  let pet9 = await db.collection('pets').findOne({name: "Coco"});
  let pet10 = await db.collection('pets').findOne({name: "Jack"});


  let user1 = await db.collection('users').findOne({firstName: "Dana"});
  let user2 = await db.collection('users').findOne({firstName: "Sydney"});
  let user3 = await db.collection('users').findOne({firstName: "Sophia"});
  let user4 = await db.collection('users').findOne({firstName: "Tim"});
  let user5 = await db.collection('users').findOne({firstName: "Paul"});
  let user6 = await db.collection('users').findOne({firstName: "Patrick"});

  // Push pet1 and pet2 to user1's favorite list
  await db.collection('users').updateOne({_id: user1._id}, {$push: {favoriteList: pet1._id}});
  await db.collection('users').updateOne({_id: user1._id}, {$push: {favoriteList: pet2._id}});

  // Push pet3 and pet4 to user2's favorite list
  await db.collection('users').updateOne({_id: user2._id}, {$push: {favoriteList: pet3._id}});
  await db.collection('users').updateOne({_id: user2._id}, {$push: {favoriteList: pet4._id}});

  // Push pet5 and pet6 to user3's favorite list
  await db.collection('users').updateOne({_id: user3._id}, {$push: {favoriteList: pet5._id}});
  await db.collection('users').updateOne({_id: user3._id}, {$push: {favoriteList: pet6._id}});

  // Push pet7 and pet8 to user4's favorite list
  await db.collection('users').updateOne({_id: user4._id}, {$push: {favoriteList: pet7._id}});
  await db.collection('users').updateOne({_id: user4._id}, {$push: {favoriteList: pet8._id}});

  // Push pet9 to user5's favorite list
  await db.collection('users').updateOne({_id: user5._id}, {$push: {favoriteList: pet9._id}});

  // Push pet1 to user5's favorite list
  await db.collection('users').updateOne({_id: user5._id}, {$push: {favoriteList: pet1._id}});

  // Push pet2 to user5's favorite list
  await db.collection('users').updateOne({_id: user5._id}, {$push: {favoriteList: pet2._id}});

  // Push pet3 to user5's favorite list
  await db.collection('users').updateOne({_id: user5._id}, {$push: {favoriteList: pet3._id}});

  // Push pet10 to user6's favorite list
  await db.collection('users').updateOne({_id: user6._id}, {$push: {favoriteList: pet10._id}});
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


  // Dogs
  let dog1 = makePet("Spot", "Labrador", "Puppy", "Small", "M", "Black", "123 Main St", "10001", "Manhattan", "New York", "A dog who is a Labrador.", "dog1.jpg");
  dog1.type.type = "Dog";
  let petType = await db.collection('petTypes').findOne({ type: "Dog" });
  dog1.type._id = petType._id;
  let user = await db.collection('users').findOne({ firstName: "John" });
  dog1.ownerId = user._id;

  let dog2 = makePet("Stella", "Retriever", "Young", "Medium", "F", "Yellow", "123 Main St", "10001", "Manhattan", "New York", "Loves to play in the mud.", "dog2.jpg");
  dog2.type.type = "Dog";
  dog2.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "John" });
  dog2.ownerId = user._id;

  let dog3 = makePet("Bella", "Poodle", "Adult", "Medium", "F", "White", "570 Water Drive", "29576", "Murrells Inlet", "South Carolina", "What an adorable poodle Bella is!", "dog3.jpg");
  dog3.type.type = "Dog";
  dog3.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Dorothy" });
  dog3.ownerId = user._id;

  let dog4 = makePet("Max", "Retriever", "Senior", "Medium", "M", "Yellow", "39 West Vale Street", "95050", "Santa Clara", "California", "Don't get on Max's bad side. He's a feisty one.", "dog4.jpg");
  dog4.type.type = "Dog";
  dog4.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Peter" });
  dog4.ownerId = user._id;

  let dog5 = makePet("Charlie", "Shepherd", "Adult", "Large", "M", "Brown", "23 East Wall Ave.", "34668", "Port Richey", "Florida", "Charlie is a sweet, loving, and caring Shepherd.", "dog5.jpeg");
  dog5.type.type = "Dog";
  dog5.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Paul" });
  dog5.ownerId = user._id;

  let dog6 = makePet("Lucy", "Poodle", "Adult", "Small", "F", "White", "619 Livingston Ave.", "33040", "Key West", "Florida", "Lucy is very playful. She loves to play with her friends.", "dog6.jpg");
  dog6.type.type = "Dog";
  dog6.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Tim" });
  dog6.ownerId = user._id;

  let dog7 = makePet("Rocky", "Poodle", "Puppy", "Small", "M", "Brown", "30 Monroe Rd.", "29708", "Fort Mill", "South Carolina", "Rocky makes him sound like a tough guy, but he's actually a big softie inside.", "dog7.jpg");
  dog7.type.type = "Dog";
  dog7.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sydney" });
  dog7.ownerId = user._id;

  let dog8 = makePet("Buddy", "Poodle", "Young", "Small", "M", "Black", "36 East Rose St.", "60008", "Rolling Meadows", "Illinois", "Buddy knows lots of fun tricks, like fetch and sit!", "dog8.jpg");
  dog8.type.type = "Dog";
  dog8.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Dana" });
  dog8.ownerId = user._id;

  let dog9 = makePet("Milo", "Pug", "Senior", "Small", "F", "Grey", "12 East Wall Ave.", "34668", "Port Richey", "Florida", "Milo sleeps a lot, so she's easy to take care of, and she loves kids too!", "dog9.jpg");
  dog9.type.type = "Dog";
  dog9.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Mariam" });
  dog9.ownerId = user._id;

  let dog10 = makePet("Daisy", "Labrador", "Adult", "Large", "F", "Black", "67 Amherst St.", "11364", "Oakland Gardens", "New York", "Daisy can be shy, but once she gets to know you, no dog is more loyal.", "dog10.jpg");
  dog10.type.type = "Dog";
  dog10.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sophia" });
  dog10.ownerId = user._id;
  

  // Cats
  let cat1 = makePet("BooBear", "Siamese", "Adult", "Small", "M", "White", "100 Washington St", "07030", "Hoboken", "New Jersey", "The BooBear doesn't fall far from the Brandon.", "cat1.jpg");
  cat1.type.type = "Cat";
  petType = await db.collection('petTypes').findOne({ type: "Cat" });
  cat1.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Martha" });
  cat1.ownerId = user._id;

  let cat2 = makePet("Shadow", "Siamese", "Young", "Small", "M", "Black", "100 Washington St", "07030", "Hoboken", "New Jersey", "Shadow hops in my sink all the time.", "cat2.jpg");
  cat2.type.type = "Cat";
  cat2.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Martha" });
  cat2.ownerId = user._id;

  let cat3 = makePet("Luna", "Maine", "Kitten", "Small", "F", "White", "619 Livingston Ave.", "33040", "Key West", "Florida", "Luna just fits right in with other cats and dogs!", "cat3.jpg");
  cat3.type.type = "Cat";
  cat3.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Tim" });
  cat3.ownerId = user._id;

  let cat4 = makePet("Oliver", "Persian", "Senior", "Extra Large", "M", "Grey", "619 Livingston Ave.", "33040", "Key West", "Florida", "The trick to getting Oliver to like you is fish", "cat4.jpg");
  cat4.type.type = "Cat";
  cat4.type._id = petType._id;
  cat4.ownerId = user._id;

  let cat5 = makePet("Loki", "Bengal", "Adult", "Medium", "M", "Black", "36 East Rose St.", "60008", "Rolling Meadows", "Illinois", "What a trickster he is!", "cat5.png" );
  cat5.type.type = "Cat";
  cat5.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Dana" });
  cat5.ownerId = user._id;

  let cat6 = makePet("Leo", "Ragdoll", "Young", "Small", "M", "Yellow", "36 East Rose St.", "60008", "Rolling Meadows", "Illinois", "Leo is one of the most playful cats I've ever known.", "cat6.jpg");
  cat6.type.type = "Cat";
  cat6.type._id = petType._id;
  cat6.ownerId = user._id;

  let cat7 = makePet("Bella", "Ragdoll", "Adult", "Large", "F", "Brown", "619 Livingston Ave.", "33040", "Key West", "Florida", "Bella is quite the little princess! Her manners are phenomenal.", "cat7.jpg");
  cat7.type.type = "Cat";
  cat7.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Tim" });
  cat7.ownerId = user._id;

  let cat8 = makePet("Willow", "Bengal", "Kitten", "Small", "F", "Grey", "7222 Bayberry Street", "33139", "Miami Beach", "Florida", "What kind of kitten is Bengal? Well, I'll let you find out.", "cat8.jpg");
  cat8.type.type = "Cat";
  cat8.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Michael" });
  cat8.ownerId = user._id;

  let cat9 = makePet("Simba", "Siamese", "Adult", "Medium", "M", "Yellow", "38 2nd St.", "11580", "Valley Stream", "New York", "He just can't wait to be king!", "cat9.jpg");
  cat9.type.type = "Cat";
  cat9.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Methuselah" });
  cat9.ownerId = user._id;

  let cat10 = makePet("Jack", "Persian", "Young", "Medium", "M", "Black", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Jack is such a fantastic friend to all the horses on our farm. Please take good care of him!", "cat10.jpg");
  cat10.type.type = "Cat";
  cat10.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Samantha" });
  cat10.ownerId = user._id;
  

  // Rabbits
  let rabbit1 = makePet("Thumper", "Domestic", "Young", "Medium", "M", "Grey", "300 Concord Road", "90002", "RealTown", "California", "They call him thumper!", "rabbit1.png");
  rabbit1.type.type = "Rabbit";
  petType = await db.collection('petTypes').findOne({ type: "Rabbit" });
  rabbit1.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sam" });
  rabbit1.ownerId = user._id;

  let rabbit2 = makePet("Oreo", "Dutch", "Adult", "Medium", "M", "Black", "7533 Old Windsor St.", "02131", "Roslindale", "Massachusetts", "He got his name from the color of his fur. It's so soft, too!", "rabbit2.jpg");
  rabbit2.type.type = "Rabbit";
  rabbit2.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Roushan" });
  rabbit2.ownerId = user._id;

  let rabbit3 = makePet("Bun Bun", "Cottontail", "Baby", "Small", "F", "Brown", "7533 Old Windsor St.", "02131", "Roslindale", "Massachusetts", "Here comes Bun Bun cottontail, hopping down the bunny trail!", "rabbit3.jpg");
  rabbit3.type.type = "Rabbit";
  rabbit3.type._id = petType._id;
  rabbit3.ownerId = user._id;

  let rabbit4 = makePet("Coco", "Domestic", "Senior", "Large", "F", "Brown", "7533 Old Windsor St.", "02131", "Roslindale", "Massachusetts", "Coco has a sassy attitude, but if you give her favorite snack to her, you'll be her new best friend.", "rabbit4.jpg");
  rabbit4.type.type = "Rabbit";
  rabbit4.type._id = petType._id;
  rabbit4.ownerId = user._id;

  let rabbit5 = makePet("Daisy", "Dutch", "Young", "Small", "F", "Yellow", "9704 Durham Street", "01867", "Reading", "Massachusetts", "Daisy is, by far, the prettiest rabbit Reading has ever seen.", "rabbit5.jpg");
  rabbit5.type.type = "Rabbit";
  rabbit5.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Feneel" });
  rabbit5.ownerId = user._id; 

  let rabbit6 = makePet("Bunnie", "Cottontail", "Adult", "Small", "F", "White", "9704 Durham Street", "01867", "Reading", "Massachusetts", "She loves to go exploring, but she'll always come home after she's done.", "rabbit6.jpg");
  rabbit6.type.type = "Rabbit";
  rabbit6.type._id = petType._id;
  rabbit6.ownerId = user._id;

  let rabbit7 = makePet("Cinnabun", "Domestic", "Baby", "Small", "M", "Grey", "9704 Durham Street", "01867", "Reading", "Massachusetts", "She is Bunnie's loving boyfriend! I hope whoever adopts Bunnie adopts Cinnabun too!", "rabbit7.jpg");
  rabbit7.type.type = "Rabbit";
  rabbit7.type._id = petType._id;
  rabbit7.ownerId = user._id;

  let rabbit8 = makePet("Snowball", "Cottontail", "Young", "Large", "M", "White", "18 E. Prairie Drive", "95820", "Sacramento", "California", "Have you ever seen a white rabbit in the snow? Exactly! You can't!", "rabbit8.jpg");
  rabbit8.type.type = "Rabbit";
  rabbit8.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Dominick" });
  rabbit8.ownerId = user._id;

  let rabbit9 = makePet("Bugz", "Cottontail", "Adult", "Extra Large", "M", "Grey", "1 Young Street", "45040", "Mason", "Ohio", "Eh, what's up, doc?", "rabbit9.jpg");
  rabbit9.type.type = "Rabbit";
  rabbit9.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Siddarth" });
  rabbit9.ownerId = user._id;
  
  let rabbit10 = makePet("Marshmallow", "Dutch", "Baby", "Small", "M", "Grey", "431 Mill Lane", "08087", "Tuckerton", "New Jersey", "Marshmallow would absolutely love to meet his new owner. He's excited just thinking about it!", "rabbit10.jpg");
  rabbit10.type.type = "Rabbit";
  rabbit10.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Patrick" });
  rabbit10.ownerId = user._id;


  // Horses
  let horse1 = makePet("Epona", "Mustang", "Adult", "Large", "F", "Brown", "300 Concord Road", "90002", "RealTown", "California", "Epona likes the sound of pretty music.", "horse1.jpg");
  horse1.type.type = "Horse";
  petType = await db.collection('petTypes').findOne({ type: "Horse" });
  horse1.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sam" });
  horse1.ownerId = user._id;

  let horse2 = makePet("Alex", "Mustang", "Young", "Medium", "M", "Black", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Alex is young and impulsive, but with the proper training, he could become a fine steed.", "horse2.jpg");
  horse2.type.type = "Horse";
  horse2.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Samantha" });
  horse2.ownerId = user._id;

  let horse3 = makePet("Lilly", "Arabian", "Senior", "Large", "F", "White", "459 Mayfield Drive", "24540", "Danville", "Virginia", "A fine racing horse, and very obedient too.", "horse3.jpg");
  horse3.type.type = "Horse";
  horse3.type._id = petType._id;
  horse3.ownerId = user._id;

  let horse4 = makePet("Alexia", "Arabian", "Adult", "Medium", "F", "Brown", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Alexia is very social among the other horses! Quite lively.", "horse4.jpg");
  horse4.type.type = "Horse";
  horse4.type._id = petType._id;
  horse4.ownerId = user._id;

  let horse5 = makePet("Fancy", "Appaloosa", "Young", "Small", "M", "Grey", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Fancy has experience in fashion shows, so look no further for a steed you wish to style and show off!", "horse5.jpg");
  horse5.type.type = "Horse";
  horse5.type._id = petType._id;
  horse5.ownerId = user._id;

  let horse6 = makePet("Sugar", "Appaloosa", "Adult", "Large", "F", "Yellow", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Despite what her name implies, Sugar has a fiery temper! Very strong-willed.", "horse6.jpg");
  horse6.type.type = "Horse";
  horse6.type._id = petType._id;
  horse6.ownerId = user._id;

  let horse7 = makePet("Lady", "Arabian", "Foal", "Small", "F", "Black", "459 Mayfield Drive", "24540", "Danville", "Virginia", "She's still quite young, but she is quite healthy! She loves letting kids pet her.", "horse7.jpg");
  horse7.type.type = "Horse";
  horse7.type._id = petType._id;
  horse7.ownerId = user._id;

  let horse8 = makePet("Tucker", "Mustang", "Adult", "Extra Large", "M", "Black", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Tucker is incredibly loyal to his owner. He has a heart to match his size.", "horse8.jpg");
  horse8.type.type = "Horse";
  horse8.type._id = petType._id;
  horse8.ownerId = user._id;

  let horse9 = makePet("Dakota", "Appaloosa", "Foal", "Small", "M", "White", "459 Mayfield Drive", "24540", "Danville", "Virginia", "Don't let Dakota fool you; he's always ready to eat! Keep your carrots and fingers hidden from this one!", "horse9.jpg");
  horse9.type.type = "Horse";
  horse9.type._id = petType._id;
  horse9.ownerId = user._id;

  let horse10 = makePet("Cash", "Mustang", "Senior", "Extra Large", "M", "White", "300 Concord Road", "90002", "RealTown", "California", "He's got his name for a reason. Just bet on him on the race track. You won't be disappointed.", "horse10.jpg");
  horse10.type.type = "Horse";
  horse10.type._id = petType._id;
  user = await db.collection('users').findOne({ firstName: "Sam" });
  horse10.ownerId = user._id;


  await db.collection('pets').insertMany([dog1, dog2, dog3, dog4, dog5, dog6, dog7, dog8, dog9, dog10, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10, rabbit1, rabbit2, rabbit3, rabbit4, rabbit5, rabbit6, rabbit7, rabbit8, rabbit9, rabbit10, horse1, horse2, horse3, horse4, horse5, horse6, horse7, horse8, horse9, horse10]);
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

  // Populate user favorite lists
  await populateUserFavoriteLists(db);

  // Have several users adopts pets
  await populateAdoptedByPets(db);

  // Populate dummy questions and answers
  await populateDummyQuestionsAnswers(db);


  console.log('Done seeding database');
  return dbConnection.closeConnection();
};

main().catch(console.log);