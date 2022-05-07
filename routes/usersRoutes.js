const express = require('express');
const usersRouter = express.Router();
const xss = require('xss');
const { users } = require('../config/mongoCollections');
const session = require('express-session');
const path = require('path');
const formidable = require('formidable');
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const emailValidator = require("email-validator");
const trimRequest = require('trim-request');
const middlewares=require('../middlewares');
const utils = require('../utils/utils');





const data = require('../data');
const usersData = data.usersData;


/**
 * Roushan Kumar
 * Login page API
 */
usersRouter
  .get('/login',middlewares.checkNotAuthenticated, (req, res) => {
    let navList = null;
    let userFirstName = null;
    if (req.session && req.session.firstName) {
      userFirstName = req.session.firstName;
      navList = utils.getLoggedInUserNavList;
    } else {
      navList = utils.getNotLoggedInUserLoginNavList;
    }
    res.render('usersViews/login', { title: "Login", navList: navList, firstName: userFirstName });
  });


/**
 * Roushan Kumar
 * Sign-up page API
 */
usersRouter
  .get('/sign-up', middlewares.checkNotAuthenticated,(req, res) => {

    let navList = null;
    let userFirstName = null;
    if (req.session && req.session.firstName) {
      userFirstName = req.session.firstName;
      navList = utils.getLoggedInUserNavList;
    } else {
      navList = utils.getNotLoggedInUserSignUpNavList;
    }
    res.render('usersViews/signUp', { title: "Sign Up", navList: navList, firstName: userFirstName });
  });


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
          if (e === `${email.trim().toLowerCase()} is already exist, please use another`) {
            return res.status(400).json({
              error: true,
              message: "Invalid input",
              email: `${email.trim()} is already exist, please use another`
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
        file.filepath = '/public/uploads/images/users/' + file.originalFilename;
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

    let email = xss(req.body.email);
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
      const user=await usersData.getUserByEmail(email.toLowerCase());
      if (userData && userData.authenticated) {
        email = email.trim().toLowerCase();
        req.session.email = email;
        req.session.firstName=user.firstName;
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

usersRouter
  .get('/logout',async (request, res) => {
    try {
      request.session.destroy();
      res.redirect("/");
    } catch (e) {
      res.status(500).json({
        error: true,
        message: "Server error while logging out."
      });
    }
  });



/**
 * Route for getting user details
 * Feneel Doshi
*/
usersRouter.get("/user-details", trimRequest.all, async (req, res) => {

  const email = xss(req.query.email);
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
usersRouter.post("/profile/update", async (request, res) => {

  try {
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
      file.filepath = '/public/uploads/images/users/' + file.originalFilename;
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

  if (!req.session || !req.session.email) {
    return res.status(401).json({
      error: true,
      message: "authentication is required",
    });
  }
  const emailId = req.session.email;
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


/**
 * Feneel Doshi
 * Route to redirect to user profile page
 */

usersRouter.get("/userProfile", middlewares.checkAuthenticated, async (req, res) => {
  let userFirstName = req.session.firstName;
  let navList = utils.getLoggedInUserUpdateProfileNavList;

  return res.render("usersViews/userProfile", { title: "User Profile", navList: navList, firstName: userFirstName })

});


/**
 * Feneel Doshi
 * Route to redirect to user's favorite pet list
 */


usersRouter.get("/favoriteList",middlewares.checkAuthenticated, async(req, res)=>{
  let userFirstName = req.session.firstName;
  let navList = utils.getLoggedInUserFavoritesNavList;

  return res.render("usersViews/favoriteList",{ title: "Favorites", navList: navList, firstName: userFirstName })

})

/**
 * Feneel Doshi
 * Route to redirect to user's account settings
 */


usersRouter.get("/accountSettings",middlewares.checkAuthenticated, async(req, res)=>{
  let userFirstName = req.session.firstName;
  let navList = utils.getLoggedInUserAccountSettingNavList;

  return res.render("usersViews/accountSettings",{ title: "Account Setting", navList: navList, firstName: userFirstName })

})

/**
 * Feneel Doshi
 * Route to redirect to user's adopted pet list
 */


usersRouter.get("/adoptedList",middlewares.checkAuthenticated, async(req, res)=>{
  let userFirstName = req.session.firstName;
  let navList = utils.getLoggedInUserAdoptedListNavList;

  return res.render("usersViews/adoptedList",{ title: "Adopted List", navList: navList, firstName: userFirstName })

})





/**
 * Feneel Doshi
 * Route for viewing owner's unanswered questions
 */

usersRouter.get("/unansweredQuestions", async(req, res)=>{
  
  const petId = xss(req.body.petId);
  const ownerId = xss(req.body.ownerId);
  if (!commonValidators.isValidId(petId)) {
    return res.status(400).json({ error: true, message: "invalid parameter", petId: "Invalid petId" });
}
if (!commonValidators.isValidId(ownerId)) {
    return res.status(400).json({ error: true, message: "invalid parameter", ownerId: "Invalid ownerId" });
}

  try{
  
    const getQuestions = await usersData.getUnansweredQuestions(ownerId, petId)

    return res.json(getQuestions)

  }

  catch (e) {
      return res.status(500).json({
        error: true,
        message: "Something went wrong, please try after sometime",
      });
  }
})


/**
 * Roushan Kumar
 * Check whether is login or not
*/
usersRouter.
  get('/auth/:email', trimRequest.all, async (req, res) => {
    const email = xss(req.params.email);

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

    if (!req.session || !req.session.email) {
      return res.status(404).json({
        isLogin:false 
      });
    }else if(req.session.email.toLowerCase()===email.toLowerCase()){
      return res.status(200).json({
        isLogin:true 
      });
    }else{
      return res.status(404).json({isLogin:false});
    }
    
  });

  /**
   * Feneel Doshi
   * Route to redirect to deleting account page
   */

  usersRouter.get('/deleteAccount', async(req, res)=>{
    let userFirstName = req.session.firstName;
  let navList = utils.getLoggedInUserDeletedAccountNavList;

  return res.render("usersViews/deleteAccount",{ title: "DeleteAccount", navList: navList, firstName: userFirstName })

    return res.render('usersViews/deleteAccount', {title: 'Delete Account'})
  })

module.exports = usersRouter;