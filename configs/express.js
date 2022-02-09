/****************************
 EXPRESS AND ROUTING HANDLING
 ****************************/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const fs = require('file-system');
const timeout = require('connect-timeout');
const glob = require('glob');

module.exports = function () {
  var app = express();

  app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(cors());

  // =======   Settings for CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(timeout(120000));
  app.use(haltOnTimedout);

  function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
  }

  app.use((err, req, res, next) => {
    return res.send({
      status: 0,
      statusCode: 500,
      message: err.message,
      error: err
    });
  })

  app.use(express.json());

  return app;
};
