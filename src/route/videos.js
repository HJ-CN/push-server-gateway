'use strict'

import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';
let Video = model.Video;

const get={
	videoList:function(req,res,next){
		Video.find({ isDelete: false}, function (err, results){
			if(err){
				res.send({ status: 'error', message: 'DB error'});
					logger.mongo.bind('Mongodb error:', err);
				}else 
				res.send({status: 'success', videoList: results});
		});
	}
};
const post={
	video:function(req,res,next){
		let video = req.params;
		Video.create(video, function (err, result) {
			if(err) {
				res.send({status: 'error', message: 'DB error'});
				logger.mongo.bind('Mongodb error:', err);
			}
			else res.send({status: 'success', video: result});
		});
	}
}

const del={
	video:function(req,res,next){
		Video.update({_id: req.params.id, isDelete: false}, { $set: { isDelete: true } }, { runValidators: true }, function (err, num) {
			
			if(num === 0) {
				res.send({status: 'error', message: 'video not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				res.send({status: 'DeleteSuccess'});
			}
		});
	 }
};



export {get, post, del};




