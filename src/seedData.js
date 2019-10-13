const models = require('./models');

models.Cache.remove({}).exec(function(err) {
	console.log('Data seeded successfully');
});
