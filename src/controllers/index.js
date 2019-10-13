const models = require('../models');
const Promise = require('bluebird');
const crypto = require("crypto");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./src/config/values.json', 'utf-8'));

exports.listAllCache = Promise.coroutine(function* (req, res) {
  try {
    const keys = yield models.Cache.find({}).exec();
    if (keys.length === 0) {
      res.status(404).send(config.no_keys);
    }
    res.status(200).send(keys);
  } catch (err) {
    res.status(400).send(config.unexpected_error, err);
  }
});

exports.getSingleCache = Promise.coroutine(function* (req, res) {
  try {
    let cache = yield models.Cache.findOne({
      key: req.params.key
    }).exec();
    let response = {};
    if (cache) {
      if (Date.parse(cache.modifiedAt) + (cache.ttl * 1000) < Date.now()) {
        cache.content = crypto.randomBytes(20).toString('hex');
        cache.save();
        message = config.cache_miss;
      } else {
        message = config.cache_hit;
      }
    } else {
      cache = yield models.Cache.create({
        key: req.params.key,
        content: crypto.randomBytes(20).toString('hex')
      });
      message = config.cache_miss;
    }
    res.status(200).send({
      message: message,
      data: cache.content
    });
  } catch (err) {
    res.status(400).send(config.unexpected_error, err);
  }
});

exports.createOrUpdateCache =  Promise.coroutine(function* (req, res) {
	if (!req.body.content) {
    return res.status(401).send({
      message: config.bad_request
    });
  }
  try {
    var cache = yield models.Cache.findOne({
      key: req.params.key
    }).exec();
    if (cache) {
      cache.content = req.body.content;
      cache.modifiedAt = new Date();
      yield cache.save();
    } else {
      cache = yield models.Cache.create({
        key: req.params.key,
        content: req.body.content
      });
    }
    res.status(200).send({
      message: config.content_inserted_to_db,
      data: cache.content
    });
  } catch (err) {
    res.status(400).send(config.unexpected_error, err);
  }
});


exports.deleteSingleCache =  Promise.coroutine(function* (req, res) {
  try {
    yield models.Cache.remove({
      key: req.params.key
    }).exec();
    res.status(200).send({
      message: 'Key ' + req.params.key + config.deleted_single_key
    });
  } catch (err) {
    res.status(400).send(config.unexpected_error, err);
  }
});


exports.deleteAllCache =  Promise.coroutine(function* (req, res) {
  try {
    yield models.Cache.remove({}).exec();
    res.status(200).send({
      message: config.deleted_all_keys
    });
  } catch (err) {
    res.status(400).send(config.unexpected_error, err);
  }

});
