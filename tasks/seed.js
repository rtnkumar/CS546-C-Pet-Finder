const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.usersData;
const postsData = data.posts;

const main = async () => {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  const roushan = await usersData.createUser("roushan", "", "kumar", "r@gmail.com", "782-923-0922", "password", "207 columbia", "jersey city", "new jersey", "07307", "picture.jpg");
  
};

main().catch(console.log);