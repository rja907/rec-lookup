/*

  This file supports POST requests for A, AAAA, CNAME, MX, TXT, NS, 
  SRV and SOA records as separate end points of the form:
  http://localhost:8000/type/:recordType

  Request format for CNAME:
  {
    "lookup": "amazon.com",
	  "recordType": "CNAME"
  }

  Request format for A, AAAA, TXT, NS, MX, SOA, SRV:
  {
    "lookup": "google.com",
	  "recordType": "NS"
  }

  *** Uncommenting line 35 will add a layer of authentication. ***

*/

// Dependencies
const morgan = require('morgan'); // For logging requests
const Joi = require('joi'); // For input validation
const express = require('express'); // Fast and light backend web framework
const helmet = require('helmet'); // For extra security
var dns = require('dns');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Importing other modules
const auth = require('./auth');
const app = express();

// Middlwares
app.use(express.json());
app.use(helmet());
//app.use(auth); // When uncommented, this can add Authentication.

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// setup the logger
router.use(morgan('combined', { stream: accessLogStream }));

router.post('/A', (req, res) => {
  const { lookup, recordType } = req.body;
  if (recordType === 'A') {
    dns.resolve4(lookup.toLowerCase(), { ttl: true }, (error, addresses) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/AAAA', (req, res) => {
  const { lookup, recordType } = req.body;
  if (recordType === 'AAAA') {
    dns.resolve6(lookup.toLowerCase(), { ttl: true }, (error, addresses) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/CNAME', (req, res) => {
  let { lookup, recordType } = req.body;
  lookup = 'www.' + lookup;
  if (recordType === 'CNAME') {
    dns.resolveCname(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/MX', (req, res) => {
  const { lookup, recordType } = req.body;
  console.log(recordType);
  if (recordType === 'MX') {
    dns.resolveMx(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        res.status(400).send(error);
      } else {
        console.log(addresses);
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/TXT', (req, res) => {
  const { lookup, recordType } = req.body;
  if (recordType === 'TXT') {
    dns.resolveTxt(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/NS', (req, res) => {
  const { lookup, recordType } = req.body;
  console.log(recordType);
  if (recordType === 'NS') {
    dns.resolveNs(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log(addresses);
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/SRV', (req, res) => {
  const { lookup, recordType } = req.body;
  console.log(recordType);
  if (recordType === 'SRV') {
    dns.resolveSrv(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log(addresses);
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

router.post('/SOA', (req, res) => {
  const { lookup, recordType } = req.body;
  console.log(recordType);
  if (recordType === 'SOA') {
    dns.resolveSoa(lookup.toLowerCase(), (error, addresses) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log(addresses);
        res.status(200).send({
          type: `${recordType}`,
          domain: lookup.toLowerCase(),
          response: addresses
        });
      }
    });
  } else {
    res
      .status(400)
      .send('Check record Type! (Make sure it is in capital letters)');
  }
});

module.exports = router;
