const express = require("express");
const adminRouter = express.Router();
const xss = require("xss");
const { admin } = require("../config/mongoCollections");
const session = require("express-session");
const path = require("path");
const formidable = require("formidable");
const validators = require("../validators");
const commonValidators = validators.commonValidators;
const emailValidator = require("email-validator");
const trimRequest = require("trim-request");
const middlewares = require("../middlewares");
const utils = require("../utils/utils");

const data = require("../data");
const adminData = data.adminData;

/**
 * Siddarth Singh
 * view profile 
 */
adminRouter.get("/profile",middlewares.checkAdminAuthenticated, async(req, res) => {
  let userAdminName = req.session.adminFirstName;
  let navList = utils.getLoggedInAdminProfileNavList;

  const adminUser=await adminData.getAdminUserByEmail(req.session.adminEmail.toLowerCase());


  return res.render("adminViews/profile", {
    title: "Admin Profiile",
    navList: navList,
    firstName: userAdminName,
    adminProfile:adminUser
  });
});

/**
 * Siddarth Singh
 * get all pets
 */
adminRouter.get("/petsList",async (req, res) => {
  let petsList=await adminData.getAllPets();
  let userAdminName = req.session.adminFirstName;
  let navList = utils.getLoggedInAdminPetsListNavList;
  return res.render("adminViews/petsList",{title: "Pet List", petsList:petsList,navList:navList,firstName:userAdminName});
});

/**
 * Siddarth Singh
 * get all users
 */
adminRouter.get("/usersList",async (req, res) => {
  let usersList=await adminData.getAllUsers();
  let userAdminName = req.session.adminFirstName;
  let navList = utils.getLoggedInAdminUsersListNavList;
  return res.render("adminViews/usersList",{title: "User List", usersList:usersList,navList:navList,firstName:userAdminName});
});


/**
 * Siddarth Singh
 * Login page API
 */
adminRouter.get("/login",middlewares.checkNotAdminAuthenticated ,(req, res) => {
  let navList = null;
  let firstName = null;
  if (req.session && req.session.adminFirstName) {
    firstName = req.session.adminFirstName;
    navList = utils.getLoggedInAdminProfileNavList;
  } else {
    navList = utils.getNotLoggedInAdminNavList;
  }
  return res.render("adminViews/login", {
    title: "Admin login",
    navList: navList,
    firstName: firstName,
  });
});

/**
 * Siddarth Singh
 * API for login
 */

 adminRouter.
  post('/login', trimRequest.all, async (req, res) => {
 
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
      const adminUserData = await adminData.checkAdminUser(email, password);
      const adminUser=await adminData.getAdminUserByEmail(email.toLowerCase());
      if (adminUserData && adminUserData.authenticated) {
        email = email.trim().toLowerCase();
        req.session.adminEmail = email;
        req.session.adminFirstName=adminUser.firstName;
        res.json(adminUserData);
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

  adminRouter
  .get('/logout',async (request, res) => {
    try {
      request.session.destroy();
      res.redirect("/admin/login");
    } catch (e) {
      res.status(500).json({
        error: true,
        message: "Server error while logging out."
      });
    }
  });

module.exports = adminRouter;
