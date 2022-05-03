const petsRouter = require('./petsRoutes.js');
const usersRouter = require('./usersRoutes.js');
const petTypesData = require('../data/petTypesData.js');

const constructorMethod = (app) => {
    app.use('/pets', petsRouter);
    app.use('/users', usersRouter);
    app.use('/', async (req, res) => {
        let petTypeList = await petTypesData.getAllPetTypes();
        res.render('home', { title: 'Home', petTypeList: petTypeList });
    });
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    })
}


module.exports = constructorMethod;
