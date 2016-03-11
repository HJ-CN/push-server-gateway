'use strict'
import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';
import config from '../../config.json';
import fs_extra from 'fs-extra';
let Template = model.Template;
let Imgmap = model.Imgmap;


const templates = [{
	id: 1,
	name: '版式1',
	content:{
		backgroundColor: 'Beige',
		items: []
	}
}, {
	id: 2,
	name: '版式2',
	content:{
		backgroundColor: 'LightSteelBlue',
		items: []
	}
}, {
	id: 3,
	name: '版式3',
	content:{
		backgroundColor: 'DarkKhaki',
		items: []
	}
}, {
	id: 4,
	name: '版式4',
	content:{
		backgroundColor: 'Gainsboro',
		items: []
	}
}, ];

const get={
	templates:function(req, res, next) {		
		Template.find({ isDelete: false}, function (err, results){
			if(err){
				res.send({ status: 'error', message: 'DB error'});
					logger.mongo.bind('Mongodb error:', err);
				}else 
				res.send({status: 'success', templates: results});
		});
	},
	template:function(req, res, next) {
		Template.findOne({ _id: req.params.id}, function (err, result){
			if(err){
				res.send({ status: 'error', message: 'DB error'});
					logger.mongo.bind('Mongodb error:', err);
				}else 
				res.send({status: 'success', template: result});
		});
	}
};

const post={
	template:function(req, res, next) {
		let template = req.params;
		Template.create(template, function (err, result) {
			if(err) {
				res.send({status: 'error', message: 'DB error'});
				logger.mongo.bind('Mongodb error:', err);
			}
			else res.send({status: 'success', template: result});
		});

	},
    thumbnail1:function(req, res, next) {
        var _id = mongoose.Types.ObjectId();
        var newFileName = process.cwd() + config.upload.path +config.upload.img + '/' + _id + '.png';
        //TODO 判断图片是否存在 如果存在 先删除
        var img = req.params.file || '';
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        fs_extra.writeFile(newFileName, buf, function (err) {
            if (err) {
                res.send({ status: 'error', message: 'Write image file failed' });
            } else {
                Imgmap.create({
                    _id: _id,
                    imgType: '.png',
                    src: config.upload.path +config.upload.img+'/'+_id
                }, function (err, image) {
                    if (err) {
                        res.send({ status: 'error', message: 'DB error' });
                        logger.logger.mongo(err);
                    } else {
                        (function () {
                            var url = config.host + '/upload/image_sources/' + image._id;
                            // res.send({status: 'success', results: url + doc._id});
                            Template.create({
                                imageUrl: url,
                                content: JSON.parse(req.params.content)
                            }, function (err, doc) {
                                if (err) {
                                    res.send({ status: 'error', message: 'DB error' });
                                    logger.logger.mongo(err);
                                } else {
                                    res.send({
                                        status: 'success',
                                        template_id: doc._id,
                                        image_url: url
                                    });
                                }
                            });
                        })();
                    }
                });
            }
        });
    }
}

const del={
    template:function(req, res, next) {
        Template.update({ _id: req.params.id},{ isDelete: true}, function (err, result){
            if(err){
                res.send({ status: 'error', message: 'DB error'});
                logger.mongo.bind('Mongodb error:', err);
            }else
                res.send({status: 'success'});
        });
    }
}

export {get,post,del};



