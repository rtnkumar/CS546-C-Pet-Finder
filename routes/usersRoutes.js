const express = require('express');
const usersRouter = express.Router();
const xss = require('xss');

const usersData = require('../data/usersData')
const path = require('path');
const formidable = require('formidable');
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const emailValidator = require("email-validator");
const trimRequest = require('trim-request');



const data = require('../data');
const { petsData } = require('../data');
const { type } = require('express/lib/response');
const usersData = data.usersData;

/**
 * User Sign-up Api
 * Roushan Kumar
 */
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
        // Schema validation
        const requestKeyList = Object.keys(fields);
        const postBodyKeys = ["firstName", "middleName", "lastName", "email", "phoneNumber", "password", "address", "city", "state", "zip"];

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
          return res.json(result);
        } catch (e) {
          if (e === `This ${email.trim().toLowerCase()} is already exist, please use another`) {
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

/**
 * User Login Api
 * Roushan Kumar
 */
usersRouter.
  post('/login', trimRequest.all, async (req, res) => {
    // Schema validation
    const requestKeyList = Object.keys(req.body);
    const postBodyKeys = ["email", "password"];

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

    const email = xss(req.body.email);
    const password = xss(req.body.password);


    // Email validation
    if (!email || email.trim() == "") {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
        email: `email is required`
      })
    }

    if (!emailValidator.validate(email.trim())) {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
        email: `${email} is invalid email format`
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

    try {
      const userData = await usersData.checkUser(email, password);
      if (userData && userData.authenticated) {
        req.session.email = email;
        res.json(userData);
      } else {
        return res.status(500).json({
          error: true,
          message: "Something went wrong, please try after sometime",
        });
      }
    } catch (error) {
      if (error === `Either the email or password is invalid`) {
        return res.status(400).json({
          error: true,
          message: "Either the email or password is invalid",
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
 * User email & password updates
 * Roushan Kumar
 */
usersRouter.
  patch('/updates/email-pass', trimRequest.all, async (req, res) => {
    const email = xss(req.body.email);
    const newEmail = xss(req.body.newEmail);
    const newPassword = xss(req.body.newPassword);
    const confirmPassword = xss(req.body.confirmPassword);
    let isEmailUpdate = false;

    // Schema validation
    const requestKeyList = Object.keys(req.body);
    let postBodyKeys = null;
    if (newEmail) {
      postBodyKeys = ["email", "newEmail"];
    } else {
      postBodyKeys = ["email", "newPassword", "confirmPassword"];
    }

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

    if (newEmail) {
      isEmailUpdate = true;
      // NewEmail validation
      if (email.trim() == "") {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          newEmail: `newEmail is required`
        })
      }

      if (!emailValidator.validate(newEmail)) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          newEmail: `${newEmail} is invalid email format`
        })
      }

    }

    if (!isEmailUpdate) {
      // newPassword validation
      let isValidPassword = commonValidators.isValidString(newPassword, 'newPassword');
      if (!isValidPassword[0]) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          newPassword: isValidPassword[1]
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          newPassword: 'password should have at least 6 characters'
        });
      }

      // confirmPassword validation
      isValidPassword = commonValidators.isValidString(confirmPassword, 'confirmPassword');
      if (!isValidPassword[0]) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          confirmPassword: isValidPassword[1]
        });
      }

      if (confirmPassword.length < 6) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          confirmPassword: 'password should have at least 6 characters'
        });
      }

      if (newPassword.trim() !== confirmPassword.trim()) {
        return res.status(400).json({
          error: true,
          message: "Invalid input",
          confirmPassword: "newPassword doesn't match with confirmPassword"
        });
      }
    }


    try {
      const updatedInfo = await usersData.updateUserEmailPassword(email, newEmail, newPassword, confirmPassword);
      if (updatedInfo && updatedInfo.isUpdated) {
        req.session.email = email;
        res.json(updatedInfo);
      } else {
        return res.status(500).json({
          error: true,
          message: "Something went wrong, please try after sometime",
        });
      }
    } catch (error) {
      if (error === `Email doesn't exist`) {
        return res.status(400).json({
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

//route for getting user details

usersRouter
    .route('users/user-details')
    .post(async(req, res)=>{
        
        let userInfo = req.body


        try{
            const {email} = userInfo
            if(!userInfo){
                throw "Error: Email cannoit be empty"
            }
            const getUserEmail = await usersData.getEmail(email)
            res.status(200).json(getUserEmail)
        }
        catch(error){

            res.status(404).json({error: 'User not found', })
        }



    });



//route for updating user details

usersRouter
    .route('users/updateDetails')
    .get(async(req, res)=>{

        if(req.session.user){
            try{
                const userInfo = await usersData.getEmail(email)
                return res.render("updateUser",{
                    title: "Update Profile",
                    user: userInfo,
                    nameOfUser: userInfo.firstName+ " " +userInfo.lastName
                })
            }
            catch(e){
                if(typeof e == "string"){
                    e = new Error(e)
                    e.code = 400
                }
            }
            return res
        }
        else{
            return res.redirect("/login")
        }

        
    })

    usersRouter
        .route("/users/update")
        .post(async(req, res)=>{
            const userData = req.body

            try{
                const firstName = userData.firstName;
                const lastName = userData.lastName;
                const phoneNumber = userData.phoneNumber;
                const address = userData.address;
                const city = userData.city;
                const state = userData.state;
                const zip = userData.zip;
               

                const updateUser = await usersData.updateUser(
                    id,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    city,
                    state,
                    zip
                )
                req.session.user = updateUser
                res.redirect("/")
            }
            catch(e){
                return res.render("updateUser", {
                    title: "Update Profile",
                    nameOfUser: req.session.user.firstName + " " + req.session.user.lastName,
                    user: req.session.user,
                    error: e
                })
            }
        })





usersRouter
    .route('/users/delete')
    .delete(async(req, res)=>{
        const email = req.params.email

        try{
            emailValidator.validate(email)

            const deleteUser = await usersData.remove(email)
            res.json("Your account has been deleted")
        }
        catch(e){
            if(typeof e == "string"){
            e = new Error(e)
            e.code = 400
        }
        return res.status(500).json(ErrorMessage(e.message))
    }
        
    })



module.exports = usersRouter;