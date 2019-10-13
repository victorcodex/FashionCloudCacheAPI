process.env.APP_ENV = 'test';
var app = require('../../../app');
var crypto = require("crypto");
var Promise = require('bluebird');
var request = require('supertest');
var should = require('should');
var _ = require('lodash');

describe('Testcases related to cache', function() {
	var url = "/cache/1";
	it('Adds new cache in list', Promise.coroutine(function* () {
		var data = {
			content: crypto.randomBytes(20).toString('hex')
		}
		var res = yield request(app)
            .post(url)
            .send(data)
            .set('Accept', 'application/json');
    	res.statusCode.should.equal(200);
		res.body.message.should.equal('Content has been successfully added in db.');
		res.body.data.should.equal(data.content);
	}));

	it('Should not add an entry if content is missing', Promise.coroutine(function* () {
		var res = yield request(app)
            .post(url)
            .set('Accept', 'application/json');
		res.statusCode.should.equal(401);
		res.body.message.should.equal('Bad request: Paramter content is required');
	}));

	it('Should update content when provided against a key', Promise.coroutine(function* () {
		var data = {
			content: "UpdatedContent"
		}
		var res = yield request(app)
	        .post(url)
	        .send(data)
	        .set('Accept', 'application/json');
		res.statusCode.should.equal(200);
		res.body.message.should.equal('Content has been successfully added in db.');
		res.body.data.should.equal(data.content);
	}));

	it('Get a key that exists in Cache', Promise.coroutine(function* () {
		var res = yield request(app)
        	.get(url)
        	.set('Accept', 'application/json');
		res.statusCode.should.equal(200);
		res.body.message.should.equal('Cache hit');
		res.body.data.should.equal('UpdatedContent');
	}));

	it('Should create a key in cache if it is accessed but doesnot exists', Promise.coroutine(function* () {
		var res = yield request(app)
            .get('/cache/2')
            .set('Accept', 'application/json');
		res.statusCode.should.equal(200);
		res.body.message.should.equal('Cache miss');
		should.exists(res.body.data); //random String
	}));

	it('Should get all keys from Cache', Promise.coroutine(function* () {
		var res = yield request(app)
        	.get('/cache')
        	.set('Accept', 'application/json');
	    res.statusCode.should.equal(200);
	    res.body.length.should.equal(2);
	}));

	it('Should delete a key when key is provided', Promise.coroutine(function* () {
		var res = yield request(app)
        	.delete('/cache/1')
        	.set('Accept', 'application/json');
		res.statusCode.should.equal(200);
		res.body.message.should.equal('Key 1 has been deleted successfully');
	}));

	it('Deletes all keys', Promise.coroutine(function* () {
	    var res = yield request(app)
	        .delete('/cache')
	        .set('Accept', 'application/json');
	    res.statusCode.should.equal(200);
    	res.body.message.should.equal('All keys have been deleted successfully');
    	res = yield request(app)
           	.get('/cache')
            .set('Accept', 'application/json');
	    res.statusCode.should.equal(404);
	    res.error.text.should.equal("No Keys found");
	}));

});
