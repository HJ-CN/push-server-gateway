'use strict'

import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
import restify from 'restify';
import _  from 'lodash';
let Page = model.Page;
let Channel=model.Channel;
let Magazine = model.Magazine;
import pageItems from './pageItems';


// 获取页面列表
const get={
	pageList:function(req, res, next) {
		
		var id = req.params.id;
		 if (!!id) {

		 	Magazine.findOne({isDelete: false, _id: id}, function (err, result){
		 		if(err) { 
					res.send({status: 'error', message: 'Mongodb error'}); 
					logger.mongo.bind('Mongodb error:', err);
				}else{
                    Channel.findOne({_id: result.channel, isDelete: false}, function (err, re) {
                        if (err) {
                            res.send({status: 'error', message: 'Mongodb error:'});
                            logger.mongo.bind('Mongodb error:', err);
                        }else {
                            var backgroundAudio=result.backgroundAudio || 'null';
                            var pageId=result.pageList;
                            var List= new Array();
                            Page.find({isDelete: false, magazine: id}, function(err, items){
                                if(err) {
                                    res.send({status: 'error', message: 'Mongodb error'});
                                    logger.mongo.bind('Mongodb error:', err);
                                }
                                else {
                                    var pageItems=items;
                                    pageId.forEach(function (item){
                                        var page=_.find(pageItems, function (page){
                                            return page._id==item.toString();
                                        });
                                        List.push(page);
                                    });
                                    res.send({
                                        status: 'success',
                                        id: id,
                                        backgroundAudio: backgroundAudio,
                                        pageItems: List,
                                        mgazinde:result,
                                        channelName:re.name
                                    });
                                }
                            });
                        }
                    });
				}
		 	});
		}else{
		 		res.send({status: 'error', message: 'Bad params'});
		 }
	},
	page:function(req, res, next) {
		let id = req.params.id;
		if(!!id) {
			Page.findOne({isDelete: false, _id: id}, function (err, result) {
				if(err) { 
					res.send({status: 'error', message: 'Mongodb error'}); 
					logger.mongo.bind('Mongodb error:', err);
				}
				else res.send({status: 'success', results: result});
			});
		} else {
			res.send({status: 'error', message: 'Bad params'});
		}
  }
};

const put={
	page:function(req, res, next) {
		let page = req.params;

		if(!!page.id) {
			Page.update({_id: page.id, isDelete: false}, { $set: { content: page.content } }, { runValidators: true }, function (err, num) {
			if(num === 0) {
				res.send({status: 'error', message: 'page not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				res.send({status: 'updateSuccess'});
			}
		});
		} else {
			res.send({status: 'error', message: 'Bad params'});
		}
   },
   order:function(req, res, next) {
   	 let page = req.params;
   	 let pageId=page.id;
   	 let magazineId=page.magazine;
   	 let pos=page.pos;
   	 Magazine.findOne({isDelete: false, _id: magazineId}, function (err, result){
   	 	if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				var pageItems=result.pageList;
					let pageId = page.id;
					let pos = page.pos;
					let index = pageItems.findIndex((item) => item == pageId);
					if(index<0){

						return res.send({
							code: 'CanNotFindPage'
						});

				}
					let obj = pageItems.splice(index, 1);
					pageItems.splice(pos, 0, obj[0]);
					Magazine.update({_id: magazineId, isDelete: false}, { $set: { pageList: pageItems } },{ runValidators: true }, function (err, num) {
							if(num === 0) {
								res.send({status: 'error', message: 'magazine not exist'});
								return;
							}
							if(err) {
								res.send({status: 'error', message: 'Mongodb error'}); 
								logger.mongo.bind('Mongodb error:', err);
							} else {
									res.send({status: 'updatesorSuccess',pageList: pageItems});
							}
					});
				}
   	 });
	 		// Page.find({isDelete: false}, function(err, results){
				// if(err) { 
				// 	res.send({status: 'error', message: 'Mongodb error'}); 
				// 	logger.mongo.bind('Mongodb error:', err);
				// }
				// else {
				// 	var pageItems=results;
				// 	let pageId = page.id;
				// 	let pos = page.pos;
				// 	let index = pageItems.findIndex((item) => item._id == pageId);
				// 	if(index<0){

				// 		return res.send({
				// 			code: 'CanNotFindPage'
				// 		});

				// }
				// 	let obj = pageItems.splice(index, 1);
				// 	pageItems.splice(pos, 0, obj[0]);
				// 	Page.remove({isDelete: false}, function (err){
				// 		if (err) {
				// 			res.send({status: 'error', message: 'Mongodb error'}); 
				// 				logger.mongo.bind('Mongodb error:', err);
				// 		};
				// 	});

				// 	for (var i = 0; i < pageItems.length; i++) {
				// 		Page.create(pageItems[i], function (err) {
				// 			if(err) { 
				// 				res.send({status: 'error', message: 'Mongodb error'}); 
				// 				logger.mongo.bind('Mongodb error:', err);
				// 				} 
				// 			});
				// 		};
				// 	res.send({
				// 		code: 'updatesorSuccess',
				// 		pageItems: pageItems
				// 		});
				// 	}
				// }); 
	},
   pageItem:function(req, res, next) {
   	let page = req.params;

		if(!!page.id) {
			Page.update({_id: page.id, isDelete: false}, { $set: { name: page.name } }, { runValidators: true }, function (err, num) {
			if(num === 0) {
				res.send({status: 'error', message: 'page not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				res.send({status: 'updateNameSuccess'});
			}
		});
		} else {
			res.send({status: 'error', message: 'Bad params'});
		}
  //  	var page = req.body;
		// let pageId = parseInt(page.id);
		// let name = page.name;
		// let index = pageItems.findIndex((item) => item.id === pageId);
		// pageItems[index].name = name;
	
		// res.send({
		// 	code: 'changeNameSuccess'
		// });
		// return next();
	}
};

const post={
	newPage:function(req, res, next) {
	let newPage = req.params;
	let id = req.params.magazine;
	Page.create(newPage, function(err, item){
			if(err) { 
				logger.mongo.bind('Mongodb error:', err);
				res.send({status: 'error', message: 'Mongodb error'}); 
				
			}
			else {
				var pageId=item._id;
				console.log("pageId:",pageId);
				Magazine.findOne({_id: id, isDelete: false}, function (err, result){
					if(err) { 
						logger.mongo.bind('Mongodb error:', err);
						res.send({status: 'error', message: 'Mongodb error'}); 
					}else{
						var newPageList=result.pageList;
						newPageList.push(pageId);
						console.log("newPageList:",newPageList);
						Magazine.update({_id: id, isDelete: false}, { $set: { pageList: newPageList } },{ runValidators: true }, function (err, num) {
							if(num === 0) {
								res.send({status: 'error', message: 'magazine not exist'});
								return;
							}
							if(err) {
								res.send({status: 'error', message: 'Mongodb error'}); 
								logger.mongo.bind('Mongodb error:', err);
							} 
						});
					}
				});
				res.send({status: 'success', page: item});
			} 
		});
    }
};

const del={
	page:function(req, res, next) {
			var pageId=req.params.id;
			var magazineId=req.params.magazine;
			Page.remove({_id: pageId}, function (err, num) {
			if(num === 0) {
				res.send({status: 'error', message: 'page not exist'});
				return;
			}
			if(err) {
				res.send({status: 'error', message: 'Mongodb error'}); 
				logger.mongo.bind('Mongodb error:', err);
			} else {
				Magazine.findOne({_id: magazineId, isDelete: false}, function (err, result){
					if(err) { 
						logger.mongo.bind('Mongodb error:', err);
						res.send({status: 'error', message: 'Mongodb error'}); 
					}else{
						var newPageList=result.pageList;
						newPageList.remove(pageId);
						console.log("newPageList:",newPageList);
						Magazine.update({_id: magazineId, isDelete: false}, { $set: { pageList: newPageList } },{ runValidators: true }, function (err, num) {
							if(num === 0) {
								res.send({status: 'error', message: 'magazine not exist'});
								return;
							}
							if(err) {
								res.send({status: 'error', message: 'Mongodb error'}); 
								logger.mongo.bind('Mongodb error:', err);
							} 
						});
					}
				});
				res.send({status: 'DeleteSuccess'});
			}
		});
		}
};


export {get,put,post,del};



