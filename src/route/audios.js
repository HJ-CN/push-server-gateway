'use strict'

import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';
let  Audio= model.Audio;

const get={
	audioList:function(req,res,next){
		Audio.find({ isDelete: false}, function (err, results){
			if(err){
				res.send({ status: 'error', message: 'DB error'});
					logger.mongo.bind('Mongodb error:', err);
				}else 
				res.send({status: 'success', audioList: results});
		});

	}
};

const post={
	audio:function(req,res,next){
		let audio = req.params;
		Audio.create(audio, function (err, result) {
			if(err) {
				res.send({status: 'error', message: 'DB error'});
				logger.mongo.bind('Mongodb error:', err);
			}
			else res.send({status: 'success', audio: result});
		});
	}
}

const del={
	audio:function(req,res,next){
		Audio.update({_id: req.params.id, isDelete: false}, { $set: { isDelete: true } }, { runValidators: true }, function (err, num) {
			
			if(num === 0) {
				res.send({status: 'error', message: 'audio not exist'});
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



