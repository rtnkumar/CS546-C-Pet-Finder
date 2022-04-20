const bcrypt = require('bcrypt');

async function  getHashedPassword(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
module.exports={
    getHashedPassword
}