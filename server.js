/****************************
 SERVER MAIN FILE
 ****************************/

// Internals
var listRouting = require('./routes/listRotes');
let config = require('./configs/configs');

// externals
let exp = require('express');
let path = require('path');
let express = require('./configs/express');
let mongoose = require('./configs/mongoose');

global.appRoot = path.resolve(__dirname);

db = mongoose();
const app = express();

app.get('/', function (req, res, next) {
    res.send('hello world');
});

/* Old path for serving public folder */
app.use('/public', exp.static(__dirname + '/public'));
app.use('/api/list', listRouting)

// Listening Server
app.listen(parseInt(config.serverPort), async () => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log(`Server running at ${config.serverHost}`);
});
