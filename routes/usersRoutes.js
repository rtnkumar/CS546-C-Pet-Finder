const express = require("express");
const usersRouter = express.Router();
const xss = require("xss");
const path = require("path");
const formidable = require("formidable");
const validators = require("../validators");
const commonValidators = validators.commonValidators;
const emailValidator = require("email-validator");
const trimRequest = require("trim-request");

const data = require("../data");
const usersData = data.usersData;



/**
 * Route for getting user details
 * Feneel Doshi
*/
usersRouter.get("/user-details",trimRequest.all,async (req, res) => {
  
  const email = xss(req.body.email);
  try {
    // Email validation
    if (!email || email.trim() == "") {
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
        email: `${email} is invalid email format`
      })
    }
    const userDetails = await usersData.getUserDetailsByEmail(email);
    res.json(userDetails);
  } catch (error) {
    if (error === `Email doesn't exist`) {
      return res.status(404).json({
        error: true,
        message: "Email doesn't exist",
      });
    } else {
      return res.status(500).json({
        error: true,
        message: "Something went wrong, please try after sometime",
      });
    }
  }
});

/**
 * Route for updating user details
 * Feneel Doshi
*/

usersRouter.post("/profile/update",async (request, res) => {
  
  try {
    if(!request.session || !request.session.email){
      return res.status(401).json({
        error: true,
        message: "authentication is required",
      });
    }
    let form = new formidable.IncomingForm();
    form.parse(request, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: "There was an error parsing the files",
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
      // Schema validation
      const requestKeyList = Object.keys(fields);
      const postBodyKeys = ["firstName", "middleName", "lastName", "phoneNumber", "address", "city", "state", "zip"];

      for (let requestKey of postBodyKeys) {
        if (requestKeyList.indexOf(requestKey) === -1) {
          return res.status(400).json({
            error: true,
            message: `${requestKey} key is missing in body`,
          });
        }
      }
      if (requestKeyList.length !== postBodyKeys.length) {
        return res.status(400).json({
          error: true,
          message: "Json body is invalid",
        });
      }
      Object.keys(fields).forEach(function (key) {
        fields[key] = (fields[key]).trim();
      });
      const firstName = xss(fields.firstName);
      const middleName = xss(fields.middleName);
      const lastName = xss(fields.lastName);
      const phoneNumber = xss(fields.phoneNumber);
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
      isValidFirstName = commonValidators.isValidName(firstName, 'firstName');
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

        isValidMiddleName = commonValidators.isValidName(middleName, 'middleName');
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
      isValidLastName = commonValidators.isValidName(lastName, 'lastName');
      if (!isValidLastName[0]) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          lastName: isValidLastName[1]
        });
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

      // Address string validation
      let isValidAddress = commonValidators.isValidString(address, 'address');
      if (!isValidAddress[0]) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          address: isValidAddress[1]
        });
      }

      isValidAddress = commonValidators.isValidAddress(address, 'address');
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

      isValidCity = commonValidators.isValidName(city, 'city');
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


      isValidState = commonValidators.isValidName(state, 'state');
      if (!isValidState[0]) {
        return res.status(400).json({

    } catch (error) {
      if (error === `Email doesn't exist`) {
        return res.status(404).json({

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
        const result = await usersData.updateUserProfile(firstName, middleName, lastName, request.session.email, phoneNumber, address, city, state, zip, picture);
        return res.json(result);
      } catch (e) {
        if (e === `user doesn't exist`) {
          return res.status(400).json({
            error: true,
            message: "Invalid input",
            email: `user doesn't exist`
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


/**
 * Route for deleting a user
 * Feneel Doshi
 */
usersRouter.route("/delete").delete(async (req, res) => {

  if(!req.session || !req.session.email){
    return res.status(401).json({
      error: true,
      message: "authentication is required",
    });
  }
  const emailId=req.session.email;  
  try {
    const deleteUser = await usersData.remove(emailId);
    res.json(deleteUser);
  } catch (e) {
    if (e == `No user with email=${emailId}`) {
      return res.status(404).json({
        error: true,
        message: e,
      });
    } else {
      return res.status(500).json({
        error: true,
        message: "Something went wrong, please try after sometime",
      });
    }
  }
});
module.exports = usersRouter;
