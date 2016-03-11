'use strict'
import mongoose from 'mongoose';
import * as model from '../model';
let Imgmap = model.Imgmap;
import request from 'request';
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';
import fs_extra from 'fs-extra';
import config from '../../config.json';
import path from 'path';
import mime from 'mime';
import {serve_static} from '../lib/serve_static.js';
import os from 'os';

// const imageList = [
// 	{
// 		id: 1,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/1.jpg'
// 	},
// 	{
// 		id: 2,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/2.jpg'
// 	},
// 	{
// 		id: 3,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/3.jpg'
// 	},
// 	{
// 		id: 4,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/4.jpg'
// 	},
// 	{
// 		id: 5,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/5.jpg'
// 	},
// 	{
// 		id: 6,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/1.jpg'
// 	},
// 	{
// 		id: 7,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/2.jpg'

// 	},
// 	{
// 		id: 8,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/3.jpg'
// 	},
// 	{
// 		id: 9,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/4.jpg'
// 	},
// 	{
// 		id: 10,
// 		'src': 'http://7xnny6.com1.z0.glb.clouddn.com/5.jpg'
// 	},
// 	{
// 		id: 11,
// 		'src': '1.png'
// 	},
// 	{
// 		id: 12,
// 		'src': '2.png'
// 	}
// ];

const get={
	imageList:function(req, res, next) {
		Imgmap.find({isDelete: false}, function (err, results) {
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo('Mongodb error:', err);
			} else {
				res.send({code: 'success', imageList: results})
			}
		});
   	},
   	image_sources:function(req, res, next) {
   		Imgmap.findOne({_id: req.params.id}, function (err, result) {
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo('Mongodb error:', err);
			} else {
				let image = process.cwd() + result.src + result.imgType;
				serve_static(req, res, image, false);
			}
		});
   	}
};

const post={
	image:function(req,res,next){
		let _id = mongoose.Types.ObjectId();
		var src = config.upload.path + config.upload.img + '/' + _id ;
		let filepath = req.files.file.path;
		var imgType = path.extname(req.files.file.name);
		let newFileName = process.cwd() + config.upload.path + config.upload.img + '/' + _id + path.extname(req.files.file.name);
	   		
		if(fs_extra.existsSync(newFileName)) fs_extra.removeSync(newFileName);
		fs_extra.move(filepath, newFileName, function (err){
			if(err) {
				res.send({status: 'error', message: 'Server internal error.'});
				logger.error('Move image files failed:', err);
			} else {
				Imgmap.create({
					_id: _id,
					src: src,
					imgType: imgType
				}, function (err){
					if(err) {
						res.send({status: 'error', message: 'DB error'});
						logger.mongo(err);
					} else {
						res.send({status: 'success', imageId: _id, imageSrc: src});
					}
				});
			}
		});
	}
}

const del={
	image:function(req, res, next) {
		Imgmap.update({_id: req.params.id, isDelete: false}, { $set: { isDelete: true } }, { runValidators: true }, function (err, num) {
			
			if(num === 0) {
				res.send({status: 'error', message: 'Image not exist'});
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

export {get,post,del}



