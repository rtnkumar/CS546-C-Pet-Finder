const { ObjectId } = require('mongodb');

/** 
 * Roushan Kumar
 * It checks whether string is valid or not
 * 
 * @param {input string} string 
 * @param {name of input} key 
 * @returns 
 */
function isValidString(string, key) {
    if (!string) return [false, `Input not supplied or NaN or undefined or null in ${key}`];
    if (!(typeof string === 'string')) {
        return [false, `${key} = ${string} is not a string!`];
    }
    string = string.trim();
    if (string.length <= 0) {
        return [false, `Input not supplied in ${key}`];
    }
    return [true];
}

/**
 * Roushan Kumar
 * It checks whether string contains only [ 0-9, a-z, A-Z ] or not 
 * 
 * @param {input string} string 
 * @param {name of input} key 
 * @returns 
 */
function isValidAlphaNumeric(string, key) {
    string = string.trim();
    const regEx = /^[0-9a-zA-Z]+$/;
    if (string.match(regEx)) {
        return [true];
    }
    else {
        return [false, `${key} is not alphanumeric`];
    }
}

/**
 * Roushan Kumar
 * It checks whether string contains [a-z, A-Z] or not
 *
 * @param {input} string 
 * @param {name of input} key 
 * @returns 
 */
function isValidAlphabet(string, key) {
    string = string.trim();
    const regEx = /^[a-zA-Z]+$/;
    if (string.match(regEx)) {
        return [true];
    }
    else {
        return [false, `Only alphabet is required in ${key}`];
    }
}

/**
 * Roushan Kumar
 * It checks whether phoneNumber is valid or not
 * @param {input parameter} phoneNumber 
 * @param {name of input} key 
 * @returns 
 */
function isValidPhoneNumber(phoneNumber, key) {
    phoneNumber = phoneNumber.trim();
    const regEx = /^\d{3}[-]\d{3}[-]\d{4}$/gm;
    if (phoneNumber.match(regEx)) {
        return [true];
    }
    else {
        return [false, `${phoneNumber} is invalid ${key}`];
    }
}


/**
 * Roushan Kumar
 * It checks whether integer is valid or not
 * 
 * @param {input integer} integer 
 * @param {name of parameter} key 
 * @returns 
 */
function isValidInteger(integer, key) {
    integer = integer.trim();
    const regEx = /^[0-9]+$/;
    if (integer.match(regEx)) {
        return [true];
    }
    else {
        return [false, `${key} is not integer`];
    }
}

/**
 * Roushan Kumar
 * Validate whether file is jpg, jpeg, png
 * 
 * @param {input file} file 
 * @returns 
 */
function isValidFile(file) {
    let type = file.filepath.split("/").pop();
    type = type.split(".").pop();
    const validTypes = ["jpg", "jpeg", "png"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};


/**
 * Roushan Kumar
 * Check whether id is valid or not
 * 
 * @param {id of mongodb} id 
 * @returns 
 */
function isValidId(id) {
    let isValidStringId=isValidString(id,'id');
    if (!isValidStringId[0]) {
        return false
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) return false;
    return true;
}


/**
 * Roushan Kumar
 * It checks whether name contains [a-z, A-Z and space] or not
 * 
 * @param {name parameter} string 
 * @param {name of parameter} key 
 * @returns 
 */
function isValidName(string, key) {
    string = string.trim();
    const regEx = /^[a-zA-Z ]+$/;
    if (string.match(regEx)) {
        return [true];
    }
    else {
        return [false, `Only alphabet and space are allowed in ${key}`];
    }
}

/**
 * Roushan Kumar
 * It checks whether address contains only [ 0-9, a-z, A-Z, space, comma, :, - ] or not 
 *
 * @param {address parameter} string 
 * @param {name of parameter} key 
 * @returns 
 */
function isValidAddress(string, key) {
    string = string.trim();
    const regEx = /^[0-9a-zA-Z ,:-]+$/;
    if (string.match(regEx)) {
        return [true];
    }
    else {
        return [false, `Only digits, alphabet, space, comma, colon and hyphen are allowed in ${key}`];
    }
}

module.exports = {
    isValidString,
    isValidAlphaNumeric,
    isValidAlphabet,
    isValidPhoneNumber,
    isValidInteger,
    isValidFile,
    isValidId,
    isValidName,
    isValidAddress
}