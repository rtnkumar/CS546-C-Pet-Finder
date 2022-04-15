const express = require('express');
const usersRouter = express.Router();
const xss = require('xss');


const data = require('../data');
const usersData = data.usersData;

usersRouter
    .route('/sign-up')
    .post(async (request, res) => {
        const firstName = xss(request.body.firstName);
        const middleName = xss(request.body.middleName);
        const lastName = xss(request.body.LastName);
        const email = xss(request.body.email);
        const phoneNumber = xss(request.body.phoneNumber);
        const password = xss(request.body.password);
        const address = xss(request.body.address);
        const city = xss(request.body.city);
        const state = xss(request.body.state);
        const zip = xss(request.body.zip);
        const picture = xss(request.body.picture);

        try {
            const result = await usersData.create(firstName, middleName, lastName, email, phoneNumber, password, address, city, state, zip, picture);
            res.json({ id: result });
        } catch (e) {
            res.json({ error: e });
        }

    });

module.exports = usersRouter;