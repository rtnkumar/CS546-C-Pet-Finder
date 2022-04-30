const express = require('express');
const petsRouter = express.Router();
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const xss = require('xss');


const data = require('../data');
const petsData = data.petsData;
const petTypesData=data.petTypesData;
const trimRequest = require('trim-request');


petsRouter.
get('/pet-types',async(req,res)=>{
 try {
     let petList= await petTypesData.getAllPetTypes();
     res.json(petList);
 } catch (error) {
     res.status(500).json({
         error:true,
         message:"Something went wrong, please try after sometime"
     })
 }
});

petsRouter.
get('/:id',trimRequest.all,async(req,res)=>{

    let id=xss(req.params.id);
    try {
     if(!commonValidators.isValidId(id)){
        return res.status(400).json({error:true,message:"invalid parameter",id:"Invalid id"});
    }
     let petList= await petsData.getPetDetailsByPetId(id);
     res.json(petList);
 } catch (error) {
     if(`No pet with id=${id.trim()}`===error){
        res.status(404).json({
            error:true,
            message:error
        });
     }else{
        res.status(500).json({
            error:true,
            message:"Something went wrong, please try after sometime"
        })
     }

 }
});
/**
 * Feneel Doshi
 * Assigning pet to user APU
 */

 petsRouter
 .post('/users/assigned-pets', trimRequest.all, async (req, res) => {
     const userId = xss(req.body.userId);
     const petId = xss(req.body.petId);

     const requestKeyList = Object.keys(req.body);
     const postBodyKeys = ["userId", "petId"];

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

     if (!userId || userId.trim() === '') {
         return res.status(400).json({ error: true, message: "invalid parameter", userId: "userId is required" });
     }

     if (!petId || petId.trim() === '') {
         return res.status(400).json({ error: true, message: "invalid parameter", userId: "petId is required" });
     }

     try {
         if (!commonValidators.isValidId(userId)) {
             return res.status(400).json({ error: true, message: "invalid parameter", userId: "Invalid userId" });
         }
         if (!commonValidators.isValidId(petId)) {
             return res.status(400).json({ error: true, message: "invalid parameter", petId: "Invalid petId" });
         }

         const assignInfo = await petsData.assignPet(userId, petId)
         res.json(assignInfo)
     }
     catch (error) {
         if (`No pet with id=${petId.trim()}` === error || `No user with id=${userId.trim()}` === error || `${petId} is already in adopted list` === error) {
             res.status(404).json({
                 error: true,
                 message: error
             });
         } else {
             res.status(500).json({
                 error: true,
                 message: "Something went wrong, please try after sometime"
             })
         }

     }
 })

module.exports = petsRouter;