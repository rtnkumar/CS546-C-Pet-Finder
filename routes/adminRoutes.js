const express = require('express');
const adminRouter = express.Router();
const xss = require('xss');
const { admin } = require('../config/mongoCollections');
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
const adminData = data.adminData;

/**
 * Siddarth Singh
 * Login page API
 */
 adminRouter
 .get('/login', (req, res) => {
     console.log("admin page");
//   let navList = null;
//   let adminFirstName = null;
//   if (req.session && req.session.firstName) {
//   adminFirstName = req.session.firstName;
//     navList = utils.getLoggedInUserNavList;
//   } else {
//     navList = utils.getNotLoggedInUserLoginNavList;
//   }
     return res.render('adminViews/login', { title: "Admin login"});
 });


/**
 * Siddarth Singh
 * API for login
 */
 adminRouter.
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
     const adminData = await adminData.checkUser(email, password);
     const admin=await adminData.getUserByEmail(email.toLowerCase());
     if (adminData && adminData.authenticated) {
       email = email.trim().toLowerCase();
       req.session.email = email;
       req.session.firstName=admin.firstName;
       res.json(adminData);
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
  * Siddarth Singh
  * 
  */

 


module.exports = adminRouter;
