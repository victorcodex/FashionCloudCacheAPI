const mongoose = require('mongoose');

const dbConnectionInit = async (config) => {
	try {
	  await mongoose.connect(config.database.mongodb.url, { useMongoClient: true });  // establish db connection
	  console.log(config.mongodb_connection_success);
	} catch (error) {
		console.error(config.mongodb_connection_error, error);
	}
};

module.exports = dbConnectionInit;