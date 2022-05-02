const express = require('express');
const petsRouter = express.Router();
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const xss = require('xss');


const data = require('../data');
const petsData = data.petsData;
const petTypesData = data.petTypesData;
const trimRequest = require('trim-request');
const { json } = require('express');


petsRouter.
    get('/pet-types', async (req, res) => {
        try {
            let petList = await petTypesData.getAllPetTypes();
            res.json(petList);
        } catch (error) {
            res.status(500).json({
                error: true,
                message: "Something went wrong, please try after sometime"
            })
        }
    });

petsRouter.
    get('/:id', trimRequest.all, async (req, res) => {

        let id = xss(req.params.id);
        try {
            if (!commonValidators.isValidId(id)) {
                return res.status(400).json({ error: true, message: "invalid parameter", id: "Invalid id" });
            }
            let petList = await petsData.getPetDetailsByPetId(id);
            res.render('petsViews/petsDetails', { title: "Pets Finder", data: JSON.stringify(petList) });
        } catch (error) {
            if (`No pet with id=${id.trim()}` === error) {
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

            let favoritePetInfo = await petsData.addPetUserFavorite(id, req.session.email);
            res.json(favoritePetInfo);
        } catch (error) {
            if (`No pet with id=${id.trim()}` === error || `${id.trim()} is already in favorite list`===error) {
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

petsRouter.
    post('/qna/:id', trimRequest.all, async (req, res) => {

        // Schema validation
        const requestKeyList = Object.keys(req.body);
        const postBodyKeys = ["question", "ownerId"];

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

        const question = xss(req.body.question);
        const petId = xss(req.params.id);
        const ownerId = xss(req.body.ownerId);

        // Password validation
        let isValidPassword = commonValidators.isValidString(question, 'question');
        if (!isValidPassword[0]) {
            return res.status(400).json({
                error: true,
                message: "Invalid input",
                password: isValidPassword[1]
            });
        }

        if (!commonValidators.isValidId(petId)) {
            return res.status(400).json({ error: true, message: "invalid parameter", petId: "Invalid petId" });
        }
        if (!commonValidators.isValidId(ownerId)) {
            return res.status(400).json({ error: true, message: "invalid parameter", ownerId: "Invalid ownerId" });
        }

        try {
            let result = await petsData.addQNA(question,petId,ownerId,"r@gmail.com");
            res.json(result);
        } catch (error) {
            if (`No pet with petId=${petId}` === error || `No user with ownerId=${ownerId}`) {
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