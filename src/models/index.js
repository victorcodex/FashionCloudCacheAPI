const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = JSON.parse(fs.readFileSync('./src/config/values.json', 'utf-8'));
const crypto = require("crypto");

//This method takes care of the overwrtitng functionality
const checkAndReplaceRecord = (next) => {
	let self = this;
	self.modifiedAt = new Date();
	if (!self.isNew) return next();
	self.model('Cache').count({}, (err, count) => {
		//check for the record that has been least modified and replace
		if (count + 1 > config.database.cache.maxLimit) {
			self.model('Cache')
				.findOne({}, {
					_id: 1
				})
				.sort({
					modifiedAt: 1
				}).exec((err, cache) => {
					self.isNew = false;
					self._id = cache._id;
					self.createdAt = new Date();
					self.modifiedAt = new Date();
					next();
				});
		} else {
			next();
		}
	});
};


//Cache
let CacheSchema = new Schema({
	key: {
		type: String,
		trim: true,
		index: true
	},
	ttl: {
		type: Number,
		default: 86400 //one day
	},
	content: {
		type: String,
		default: (Math.random() + 1).toString(36).substring(7) //generates a random String
	},
	modifiedAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		index: true
	}
}, {
	collection: 'cache'
});

CacheSchema.pre('save', checkAndReplaceRecord);

module.exports.Cache = mongoose.model('Cache', CacheSchema);
