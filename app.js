const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');


const routes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

let logger = (req, res, next) => {
  let msg = null;
  if (req.session && req.session.email) {
    msg="(Authenticated User)";
  }else{
    msg="(Non-Authenticated User)";
  }
  console.log("[" + new Date().toUTCString() + "]: " + req.method + " " + req.originalUrl+" "+msg);
  next();
};


app.use(session({
  name: 'AuthCookie',
  secret: 'rsfdteprednifpw',
  resave: false,
  saveUninitialized: true
}));

app.use(logger);
routes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});