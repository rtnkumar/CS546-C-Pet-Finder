const petsRouter = require('./petsRoutes.js');
const usersRouter = require('./usersRoutes.js');
const petTypesData = require('../data/petTypesData.js');
const utils = require('../utils/utils');


const constructorMethod = (app) => {
    app.use('/pets', petsRouter);
    app.use('/users', usersRouter);
    app.use('/', async (req, res) => {
        let petTypeList = await petTypesData.getAllPetTypes();
        let navList=null;
        let userFirstName=null;
        if(req.session && req.session.firstName){
            userFirstName=req.session.firstName;
            navList=utils.getLoggedInUserHomeNavList;
        }else{
            navList=utils.getNotLoggedInUserHomeNavList;
        }
        
        res.render('home', { title: "Pet Finder",navList:navList,firstName:userFirstName, petTypeList: petTypeList });
    });
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    })
}


module.exports = constructorMethod;
