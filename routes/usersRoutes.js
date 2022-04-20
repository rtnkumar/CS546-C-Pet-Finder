const express = require('express');
const usersRouter = express.Router();
const xss = require('xss');
const path = require('path');
const formidable = require('formidable');
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const emailValidator = require("email-validator");



const data = require('../data');
const usersData = data.usersData;


usersRouter
  .post('/sign-up', async (request, res) => {
    try {
      let form = new formidable.IncomingForm();
      form.parse(request, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
        else if (!files || Object.keys(files).length == 0 || !files.picture) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            picture: "picture is required"
          });
        }
        else if (files.picture.size <= 0) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            picture: "picture size is zero"
          });
        }
        const isValid = commonValidators.isValidFile(files.picture);
        if (!isValid) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            picture: "Only jpg, jpeg or png are required!"
          });
        }

        const firstName = xss(fields.firstName);
        const middleName = xss(fields.middleName);
        const lastName = xss(fields.lastName);
        const email = xss(fields.email);
        const phoneNumber = xss(fields.phoneNumber);
        const password = xss(fields.password);
        const address = xss(fields.address);
        const city = xss(fields.city);
        const state = xss(fields.state);
        const zip = xss(fields.zip);
        const picture = xss(files.picture.originalFilename);

        // FirstName string validation
        let isValidFirstName = commonValidators.isValidString(firstName, 'firstName');
        if (!isValidFirstName[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            firstName: isValidFirstName[1]
          });
        }

        // FirstName alphabet validation
        isValidFirstName = commonValidators.isValidAlphabet(firstName, 'firstName');
        if (!isValidFirstName[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            firstName: isValidFirstName[1]
          });
        }

        // MiddleName validation
        if (middleName) {
          let isValidMiddleName = commonValidators.isValidString(middleName, 'middleName');
          if (!isValidMiddleName[0]) {
            return res.status(400).json({
              error: true,
              message: "Invalid input",
              middleName: isValidMiddleName[1]
            });
          }

          isValidMiddleName = commonValidators.isValidAlphabet(middleName, 'middleName');
          if (!isValidMiddleName[0]) {
            return res.status(400).json({
              error: true,
              message: "Invalid input",
              middleName: isValidMiddleName[1]
            });
          }
        }

        // LastName string validation
        let isValidLastName = commonValidators.isValidString(lastName, 'lastName');
        if (!isValidLastName[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            lastName: isValidLastName[1]
          });
        }

        // LastName alphabet validation
        isValidLastName = commonValidators.isValidAlphabet(lastName, 'lastName');
        if (!isValidLastName[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            lastName: isValidLastName[1]
          });
        }

        // Email validation
        if (!email) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            email: `email is required`
          })
        }

        if (!emailValidator.validate(email)) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            email: `${email} is invalid email`
          })
        }

        // PhoneNumber validation
        if (!phoneNumber) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            phoneNumber: "phoneNumber is required"
          })
        }

        let isValidPhoneNumber = commonValidators.isValidPhoneNumber(phoneNumber, 'phoneNumber');
        if (!isValidPhoneNumber[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            phoneNumber: isValidPhoneNumber[1]
          })
        }

        // Password validation
        let isValidPassword = commonValidators.isValidString(password, 'password');
        if (!isValidPassword[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            password: isValidPassword[1]
          });
        }

        if (password.length < 6) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            password: 'password should have at least 6 characters'
          });
        }

        // Address string validation
        let isValidAddress = commonValidators.isValidString(address, 'address');
        if (!isValidAddress[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            address: isValidAddress[1]
          });
        }

        // City string validation
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            city: isValidCity[1]
          });
        }

        // State string validation
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            state: isValidState[1]
          });
        }

        // Zip string validation
        let isValidZip = commonValidators.isValidString(zip, 'zip');
        if (!isValidZip[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            zip: isValidZip[1]
          });
        }

        isValidZip = commonValidators.isValidInteger(zip, 'zip');
        if (!isValidZip[0]) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            zip: isValidZip[1]
          });
        }

        try {
          const result = await usersData.createUser(firstName, middleName, lastName, email, phoneNumber, password, address, city, state, zip, picture);
         // return res.json({ id: result, firstName: firstName, middleName: middleName, lastName: lastName, email: email, phoneNumber: phoneNumber, password: password, address: address, city: city, state: state, zip: picture });
          return res.json(result);
        
        } catch (e) {
          if (e === `This ${email.trim()} is already exist, please use another`) {
            return res.status(400).json({
              error: true,
              message: "Invalid input",
              email: `This ${email.trim()} is already exist, please use another`
            });
          } else {
            return res.status(500).json({
              error: true,
              message: e,
            });
          }
        }

      });

      form.on('fileBegin', function (name, file) {
        file.filepath = 'public/uploads/images/users/' + file.originalFilename;
      });

    } catch (e) {
      return res.status(500).json({
        error: true,
        message: e,
      });
    }
  });

usersRouter.
  post('/upload', async (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(fields);
      field = fields;
      console.log(files.upload.size);
      const isValid = isFileValid(files.upload);
      console.log("isValid+" + isValid);
      if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }
    });

    form.on('fileBegin', function (name, file) {
      file.filepath = 'public/uploads/images/users/' + file.originalFilename;
    });

    // form.on('file', function (name, file){
    //     console.log('Uploaded ' + file.originalFilename);
    // });

    res.sendFile(path.resolve('static/home.html'));

  });

module.exports = usersRouter;