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
 .route('users/assignedPets')
 .post(async(req, res)=>{
     let assignedPetInfo = req.body
     
     try{
        if(!commonValidators.isValidId(id)){
            return res.status(400).json({error:true,message:"invalid parameter",id:"Invalid id"});
        }
         const {petId} = assignedPetInfo
         const addPet = await petsData.assignPet(assignedPetInfo)
         res.json(addPet)

     }
     catch(e){
         return res.status(400).json({error: e})
     }
 })


module.exports = petsRouter;