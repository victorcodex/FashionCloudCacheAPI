const express = require('express');
const dbConnectionInit = require('./src/dbconnection');
const fs = require('fs');
const apiRoutes = require('./src/routes');
const app = express();
const middlewares = require('./src/middlewares');
const config = JSON.parse(fs.readFileSync('./src/config/values.json', 'utf-8'));
const port = process.env.PORT || 5000; // Set Server port

dbConnectionInit(config); // init DB connection
middlewares(app); // middlewares
apiRoutes(app);// apiRoutes initialization
if (config.database.mongodb.seed) require('./src/seedData'); // insert seed data into cache collection

const server = app.listen(port, function() { // server port listen
	console.log(config.server_port_connection + server.address().port);
});

module.exports = app;