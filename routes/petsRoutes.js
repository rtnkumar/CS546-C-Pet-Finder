const express = require('express');
const petsRouter = express.Router();

const xss = require('xss');


const data = require('../data');
const petsData = data.petsData;

/**
 * Feneel Doshi
 * Assigning pet to user APU
 */

petsRouter
    .route('users/assignedPets')
    .post(async(req, res)=>{
        let assignedPetInfo = req.body
        
        try{
            const {petId} = assignedPetInfo
            const addPet = await petsData.assignPet(assignedPetInfo)
            res.json(addPet)

        }
        catch(e){
            return res.status(400).json({error: e})
        }
    })


module.exports = petsRouter;