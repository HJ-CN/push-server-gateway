'use strict'
import mongoose from 'mongoose';
import * as model from '../model';
let Channel = model.Channel;
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';

// const channels=[{
// 		"id":111,
// 		"name":"channel1"
// 	},{
// 		"id":222,
// 		"name":"channel2"
// 	},{
// 		"id":333,
// 		"name":"channel3"
// 	},{
// 		"id":444,
// 		"name":"channel4"
// 	},{
// 		"id":555,
// 		"name":"channel5"
// 	}];

const get={
	channels:function(req,res,next){
		Channel.find({ isDelete: false}, function (err, results) {
			if(err) {
				res.send({status: 'error', message: 'Mongodb error:'});
				logger.mongo.bind('Mongodb error:', err);
			}
				else res.send({status: 'success', channels: results });
			});
	}
};

const post={
	channel:function(req,res,next){
		let _id = mongoose.Types.ObjectId();
		Channel.create({_id: _id, name: req.body.name}, function (err, result) {
			if(err) {
				res.send({status: 'error', message: 'Mongodb error:'});
				logger.mongo.bind('Mongodb error:', err);
			}
				else res.send({status: 'success', channel: result });
			});
	}
};

const put={
	channel:function(req,res,next){
			Channel.update({_id: req.params.id, isDelete: false}, { $set: { name: req.body.name } }, { runValidators: true }, function (err, num) {
		
			if(num === 0) {
				res.send({status: 'error', message: 'channel not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				res.send({status: 'updateSuccess'});
			}
		});
	// 	var channel=_.find(channels,function(channel){
	// 		return channel.id==parseInt(req.params.id)
	// 	});
	// 	if(channel){
	// 	channel.name=req.body.name;
	// 	res.send({
	// 		code: "updateSuccess"
	// 	});
	// }else{
	// 	res.send({
	// 		code: "CanNotFindChannle"
	// 	});
	// }
	// 	return next();
	}

};

const del={
	channel:function(req,res,next){
		Channel.update({_id: req.params.id, isDelete: false}, { $set: { isDelete: true } }, { runValidators: true }, function (err, num) {
			
			if(num === 0) {
				res.send({status: 'error', message: 'channel not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				res.send({status: 'DeleteSuccess'});
			}
		});
		// _.remove(channels,function(channel){
		// 	return channel.id==parseInt(req.params.id)
		// });
		// res.send({
		// 	code: "deleteSuccess"
		// });
		// return next();
	}
}

export {get,post,put,del};




