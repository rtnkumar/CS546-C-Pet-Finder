const petsRouter = require('./petsRoutes.js');
const usersRouter = require('./usersRoutes.js');

const constructorMethod = (app) => {
    app.use('/pets', petsRouter);
    app.use('/users', usersRouter);
    app.use('/', (req, res) => {
        res.render('home');
    });
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    })
}


module.exports = constructorMethod;
