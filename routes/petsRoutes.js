const express = require('express');
const petsRouter = express.Router();
const validators = require('../validators');
const commonValidators = validators.commonValidators;
const xss = require('xss');
const trimRequest = require('trim-request');
const data = require('../data');
const petsData = data.petsData;
const petTypesData = data.petTypesData;
const usersData = data.usersData;
const mongoCollections = require('../config/mongoCollections');
const petTypes = mongoCollections.petTypes;
const formidable = require('formidable');



// Routes
petsRouter
    // Route to perform the homePageSearch
    // Example route with query params: pets/search-home/?city=${city_term}&state=${state_term}&zip=${zip_term}&type=${type_term} 
    .get('/search-home', trimRequest.all, async (req, res) => {
        // Validation
        let city = xss(req.query.city);
        let state = xss(req.query.state);
        let zip = xss(req.query.zip);
        let type = xss(req.query.type);

        // If no query params, return an error
        if ((!city) && (!state) && (!zip)) {
            return res.status(400).json({
                error: true,
                message: 'Must supply city, state, or zip'
            });
        }
        if (!type) {
            return res.status(400).json({
                error: true,
                message: 'Must supply pet type'
            });
        }

        // Validate city
        try {
            if (city) cityTests(city);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                city: city
            });
        }

        // Validate state
        try {
            if (state) stateTests(state);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                state: state
            });
        }

        // Validate zip
        try {
            if (zip) zipTests(zip);
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                zip: zip
            });
        }

        // Validate petType
        try {
            if (type) await petTypeTests(type);
            else return res.status(400).json({
                error: true,
                message: 'No petType given'
            });
        } catch (e) {
            return res.status(400).json({
                error: true,
                message: e,
                type: type
            });
        }

        // Response
        try {
            const pets = await petsData.homePageSearch(city, state, zip, type);
            res.status(200).json({
                error: false,
                pets: pets
            });
        } catch (e) {
            if (e === 'No pets found') {
                return res.status(404).json({
                    error: true,
                    message: e
                });
            } else {
                return res.status(500).json({
                    error: true,
                    message: e
            });

        }
    }
});

petsRouter
    .post('/upload', trimRequest.all, async (request, res) => {
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
              const postBodyKeys = ["name", "type", "breed", "age", "size", "gender", "color", "address", "zip", "city", "state", "description", "ownerId"];

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
                const name = xss(fields.name);
                const type = xss(fields.type);
                const breed = xss(fields.breed);
                const age = xss(fields.age);
                const size = xss(fields.size);
                const gender = xss(fields.gender);
                const color = xss(fields.color);
                const address = xss(fields.address);
                const zip = xss(fields.zip);
                const city = xss(fields.city);
                const state = xss(fields.state);
                const description = xss(fields.description);
                const ownerId = xss(fields.ownerId);
                const picture = xss(files.picture.originalFilename);
      
              // Name string validation
              let isValidName = commonValidators.isValidString(name, 'name');
              if (!isValidName[0]) {
                return res.status(400).json({
                  error: true,
                  message: "Invalid input",
                  name: isValidName[1]
                });
              }
      
              // Name alphabet validation
              isValidName = commonValidators.isValidName(name, 'name');
              if (!isValidName[0]) {
                return res.status(400).json({
                  error: true,
                  message: "Invalid input",
                  name: isValidName[1]
                });
              }   

                // Validate petType
                try {
                    if (type) await petTypeTests(type);
                    else return res.status(400).json({
                        error: true,
                        message: 'No petType given',
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: e,
                        type: type
                    });
                }


                // Breed
                try {
                    if (breed) await breedTests(breed,type);
                    else return res.status(400).json({
                        error: true,
                        message: 'No breed given'
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        breed: e
                    });
                }


                // Age
                try {
                    if (age)await ageTests(age,type);
                    else return res.status(400).json({
                        error: true,
                        message: 'No age given'
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        age: e
                    });
                }

                // Size
                try {
                    if (size) await sizeTests(size,type);
                    else return res.status(400).json({
                        error: true,
                        message: 'No size given'
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        size: e
                    });
                }

                // Gender
                try {
                    if (gender) genderTests(gender);
                    else return res.status(400).json({
                        error: true,
                        message: 'No gender given'
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        gender: e
                    });
                }

                // Color
                try {
                    if (color) await colorTests(color,type);
                    else return res.status(400).json({
                        error: true,
                        message: 'No color given'
                    });
                } catch (e) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        color: e
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
              if (zip.length > 5) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid input",
                    zip: "Zip code too long"
                });
            }


                // Description
                let isValidDescription = commonValidators.isValidString(description, 'description');
                if (!isValidDescription[0]) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        description: isValidDescription[1]
                    });
                }


                // OwnerId
                let isValidOwnerId = commonValidators.isValidId(ownerId);
                if (!isValidOwnerId) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid input",
                        ownerId: "Invalid ownerId"
                    });
                }


      
              try {
                const pet = await petsData.createPet(name, type, breed, age, size, gender, color, address, zip, city, state, description, ownerId, picture);
                pet.error = false;
                res.status(200).json(pet);
              } catch (e) {
                if (e === `${type} is not a valid petType`||
                e===`${breed} is not a valid breed for ${type}`||
                e===`${age} is not a valid age for ${type}`||
                e===`${size} is not a valid size for ${type}`||
                e===`${color} is not a valid color for ${type}`||
                e===`${ownerId} does not belong to any owner`
                ) {
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
      
            form.on('fileBegin', function (name, file) {
              file.filepath = 'public/uploads/images/pets/' + file.originalFilename;
            });
      
          } catch (e) {
            return res.status(500).json({
              error: true,
              message: e,
            });
          }
    });


// Testing functions
function stateTests(state) {
    // Validate state
    if (state) {
        // Valid String
        let isValidState = commonValidators.isValidString(state, 'state');
        if (!isValidState[0]) throw isValidState[1];

        // Valid Name
        isValidState = commonValidators.isValidName(state, 'state');
        if (!isValidState[0]) throw isValidState[1];
    }
}

function cityTests(city) {
    // Validate city
    if (city) {
        // Valid String
        let isValidCity = commonValidators.isValidString(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];

        // Valid Name
        isValidCity = commonValidators.isValidName(city, 'city');
        if (!isValidCity[0]) throw isValidCity[1];
    }
}

function zipTests(zip) {
    if (zip) {
        // Valid String
        let isValidZip = commonValidators.isValidString(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid Integer
        isValidZip = commonValidators.isValidInteger(zip, 'zip');
        if (!isValidZip[0]) throw isValidZip[1];

        // Valid length
        if (zip.length > 5) throw 'zip is not of length 5';
    }
}

async function petTypeTests(petType) {
    // Validate petType
    const petTypeCollection = await petTypes();
    if (petType) {
        // Valid String
        let isValidPetType = commonValidators.isValidString(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Alphabet
        isValidPetType = commonValidators.isValidAlphabet(petType, 'petType');
        if (!isValidPetType[0]) throw isValidPetType[1];

        // Valid Existence in petTypes collection
        isValidPetType = await petTypeCollection.findOne({
            type: petType
        });
        if (!isValidPetType) throw `${petType} is not a valid petType`;
    }
}

async function existInPetTypeCollection(petType, breed, age, color, size) {
    // Validate they exist together
    // { $and: [{ breed: { $in: [ breed ] } }, {type: petType}, { age: { $in: [ age ] } }, { size: { $in: [ size ] } },  { color: { $in: [ color ] } }  ] }
    const petTypeCollection = await petTypes();
    let isValidPet = await petTypeCollection.findOne({
        $and: [{ breed: { $in: [ breed ] } },
               { type: petType},
               { age: { $in: [ age ] } },
               { size: { $in: [ size ] } },
               { color: { $in: [ color ] } }]
    });
    if (!isValidPet) throw "Mismatch in petType, breed, color, size";
}

function nameTests(name) {
    // Validate name
    if (name) {
        // Valid String
        let isValidName = commonValidators.isValidString(name, 'name');
        if (!isValidName[0]) throw isValidName[1];

        // Valid Alphabet
        isValidName = commonValidators.isValidAlphabet(name, 'name');
        if (!isValidName[0]) throw isValidName[1];
    }
}

async function breedTests(breed, petType) {
    // Validate breed
    if (breed) {
        // Valid String
        let isValidBreed = commonValidators.isValidString(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

        // Valid Alphabet
        isValidBreed = commonValidators.isValidAlphabet(breed, 'breed');
        if (!isValidBreed[0]) throw isValidBreed[1];

        // Check breed in petTypes collection
        const petTypeCollection = await petTypes();
        let isValidPet = await petTypeCollection.findOne({
            $and: [{ type: petType }, { breed: breed }]
        });
        if (!isValidPet) throw `${breed} is not a valid breed for ${petType}`;
    }
}

async function ageTests(age, petType) {
    // Validate age
    if (age) {
        
        // Check age in petTypes collection
        const petTypeCollection = await petTypes();
        let isValidPet = await petTypeCollection.findOne({
            $and: [{ type: petType }, { age: age }]
        });
        if (!isValidPet) throw `${age} is not a valid age for ${petType}`;
    }
}

async function sizeTests(size, petType) {
    // Validate size
    if (size) {
        // Valid String
        let isValidSize = commonValidators.isValidString(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Valid Alphabet
        isValidSize = commonValidators.isValidAlphabet(size, 'size');
        if (!isValidSize[0]) throw isValidSize[1];

        // Check size in petTypes collection
        const petTypeCollection = await petTypes();
        let isValidPet = await petTypeCollection.findOne({
            $and: [{ type: petType }, { size: size }]
        });
        if (!isValidPet) throw `${size} is not a valid size for ${petType}`;
    }
}

function genderTests(gender) {
    // Validate gender 
    if (gender) {
        // Valid String
        let isValidGender = commonValidators.isValidString(gender, 'gender');
        if (!isValidGender[0]) throw isValidGender[1];

        if (gender.toUpperCase() !== 'M' && gender.toUpperCase() !== 'F') throw "Gender must be male or female"
    }
}

async function colorTests(color, petType) {
    if (color) {
        // Valid String
        let isValidColor = commonValidators.isValidString(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Valid Alphabet
        isValidColor = commonValidators.isValidAlphabet(color, 'color');
        if (!isValidColor[0]) throw isValidColor[1];

        // Check color in petTypes collection
        const petTypeCollection = await petTypes();
        let isValidPet = await petTypeCollection.findOne({
            $and: [{ type: petType }, { color: color }]
        });
        if (!isValidPet) throw `${color} is not a valid color for ${petType}`;
    }
}

function addressTests(address) {
    if (address) {
        // Valid String
        let isValidAddress = commonValidators.isValidString(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

        // Valid Alphabet
        isValidAddress = commonValidators.isValidAlphabet(address, 'address');
        if (!isValidAddress[0]) throw isValidAddress[1];

    }
}

function descriptionTests(description) {
    if (description) {
        // Valid String
        let isValidDescription = commonValidators.isValidString(description, 'description');
        if (!isValidDescription[0]) throw isValidDescription[1];
    } else throw "description is required";
}

async function ownerIdTests(ownerId) {
    if (ownerId) {
        // Valid String
        let isValidOwnerId = commonValidators.isValidString(ownerId, 'ownerId');
        if (!isValidOwnerId[0]) throw isValidOwnerId[1];

        // Valid ObjectId
        if (!ObjectId.isValid(ownerId)) throw `${ownerId} is not a valid ObjectId`;

        // Valid Existence in owners collection
        let isValidExists = await usersData.getUserById(ownerId);
        if (!isValidExists) throw `${ownerId} does not belong to any owner`;
    }
}

function pictureTests(picture) {
    if (picture) {
        // Valid String
        let isValidPicture = commonValidators.isValidString(picture, 'picture');
        if (!isValidPicture[0]) throw isValidPicture[1];

        // Valid file
        isValidPicture = commonValidators.isValidFile(picture, 'picture');
        if (!isValidPicture) throw `${picture} is not a valid file`;
    }
}

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

/**
 * Feneel Doshi
 * Assigning pet to user API
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
