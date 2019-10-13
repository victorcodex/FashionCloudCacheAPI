const CacheController = require('./controllers');

const apiRoutes = (app) => {
	app.get('/api/listAllCache', CacheController.listAllCache);
	app.get('/api/getSingleCache/:key', CacheController.getSingleCache);
	app.post('/api/createOrUpdateCache/:key', CacheController.createOrUpdateCache);
	app.put('/api/createOrUpdateCache/:key', CacheController.createOrUpdateCache);
	app.delete('/api/deleteSingleCache/:key', CacheController.deleteSingleCache);
	app.delete('/api/deleteAllCache', CacheController.deleteAllCache);
}

module.exports = apiRoutes;