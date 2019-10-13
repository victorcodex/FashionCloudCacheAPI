const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');

const middleWares = (app) => {
	app.get('env') === 'development' ? app.use(errorHandler()) : ""; // use error handler for dev mode
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
}

module.exports = middleWares;