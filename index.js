/*

  This file supports POST requests for A, CNAME, TXT and SRV  records as separate end points of the form:
  http://localhost:8000

  Almost none of the sites support all 4 records.

  To verify for A, TXT and CNAME records use the following request format:
  {
    "lookup": "www.twitter.com",
	  "recordType": ["A", "TXT", "CNAME"]
  }

  To verify SRV record use the following request format:
  {
    "lookup": "www.google.com",
	  "recordType": ["SRV"]
  }

  To verify CNAME record use the following request format:
  {
    "lookup": "www.amazon.com",
	  "recordType": ["CNAME"]
  }

*/
// Dependencies
const morgan = require('morgan'); // For logging requests
const Joi = require('joi'); // For input validation
const express = require('express'); // Fast and light backend web framework
const helmet = require('helmet'); // For extra security
var dns = require('dns');
const async = require('async');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const separate = require('./routes/separate.js');
const basicAuth = require('./routes/basicAuth');

// Importing other modules
const auth = require('./routes/auth');
const app = express();

// Middlwares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/type', separate);
app.use('/basicAuth', basicAuth);
//app.use(auth);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Main POST request (to the root '/')
app.post('/', (req, res) => {
  // Using destructor to fetch properties
  let { lookup, recordTypes } = req.body;
  //console.log(lookup, recordTypes);
  let result = [];
  for (type of recordTypes) {
    if (type === 'A') {
      dns.resolve4(lookup.toLowerCase(), { ttl: true }, (error, addresses) => {
        if (error) {
          result.push({
            type: `A`,
            response: { hostname: `${lookup}`, information: `Not available` }
          });
        } else {
          result.push({
            type: `A`,
            response: { hostname: `${lookup}`, information: addresses }
          });
        }
      });
    } else if (type === 'SRV') {
      lookupSrv = '_jabber._tcp.';
      lookupSrv = lookupSrv + lookup.slice(4);
      //console.log(lookupSrv);
      dns.resolveSrv(lookupSrv.toLowerCase(), (error, addresses) => {
        if (error) {
          result.push({
            type: `SRV`,
            response: { hostname: `${lookupSrv}`, information: `Not available` }
          });
        } else {
          console.log(addresses);
          result.push({
            type: `SRV`,
            response: { hostname: `${lookupSrv}`, information: addresses }
          });
        }
      });
    }
  }

  async.each(
    recordTypes,
    (type, done) => {
      dns.resolve(lookup.toLowerCase(), type, (err, addresses) => {
        if (err && type !== 'SRV') {
          result.push({ type: `${type}`, errCode: err.code });
        } else if (addresses === []) {
          result.push({
            type: `${type}`,
            response: { hostname: `${lookup}`, information: `Not available` }
          });
        } else {
          if (type === 'A' || type === 'SRV') {
          } else {
            result.push({
              type: `${type}`,
              response: { hostname: `${lookup}`, addresses }
            });
          }
        }
        done(err);
      });
    },
    allOverError => {
      resp = { hits: result };
      res.send(resp);
    }
  );
});

// PORT definition (for running in prod or dev environments)
const port = process.env.PORT || 8000;

// Listen for client request on the port set in dev and prod.
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
