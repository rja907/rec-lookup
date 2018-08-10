// Dependencies
const morgan = require('morgan'); // For logging requests
const express = require('express'); // Fast and light backend web framework
const helmet = require('helmet'); // For extra security
const router = express.Router();
const auth = require('basic-auth');
const fs = require('fs');
const path = require('path');

const admins = { evo: { password: 'calize' } };

// Importing other modules
const app = express();

// Middlwares
app.use(helmet());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// setup the logger
router.use(morgan('combined', { stream: accessLogStream }));

router.post('/', (req, res) => {
  var user = auth(req);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    res.set('WWW-Authenticate', 'Need basic authorization');
    return res.status(401).send('You are not authorized!');
  } else {
    res.send(req.body.name + ' is authorized!');
  }
});

module.exports = router;
