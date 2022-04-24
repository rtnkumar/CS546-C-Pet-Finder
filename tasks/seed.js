const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.usersData;
const petsData = data.petsData;

const main = async () => {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  const roushan = await usersData.createUser("roushan", "", "kumar", "r@gmail.com", "782-923-0922", "password", "207 columbia", "jersey city", "new jersey", "07307", "picture.jpg");
  const feneel = await usersData.createUser("feneel", "", "doshi", "f@gmail.com", "123-456-7890", "passwd", "123 washington", " hoboken", "new jersey", "07030", "pic.jpg");
  const siddharth = await usersData.createUser("siddharth", "", "singh", "s@gmail.com", "321-923-0922", "passd", "321 washington", "hoboken", "new jersey", "07030", "picture12.jpg");
  const dominick = await usersData.createUser("dominick", "", "varano", "d@gmail.com", "782-654-0922", "pword", "456 washington", "hoboken", "new jersey", "07030", "picture21.jpg");

};

main().catch(console.log);