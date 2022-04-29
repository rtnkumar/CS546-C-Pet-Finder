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
 * Adding pet in favorite list
 * Roushan Kumar
 */
 petsRouter.
 post('/favorites/pets/:id', trimRequest.all, async (req, res) => {
   let id = xss(req.params.id);
   try {
     if (!commonValidators.isValidId(id)) {
       return res.status(400).json({ error: true, message: "invalid parameter", id: "Invalid id" });
     }
     
     let favoritePetInfo = await petsData.addPetUserFavorite(id,"d@gMail.COM");
     res.json(favoritePetInfo);
   } catch (error) {
     if (`No pet with id=${id.trim()}` === error || `${id.trim()} is already in favorite list`) {
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
// Schema validation

module.exports = petsRouter;