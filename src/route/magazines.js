'use strict'

import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
import restify from 'restify';
import async from 'async';
import _  from 'lodash';
let Magazine = model.Magazine;
let Page = model.Page
let Channel=model.Channel

// const magazines=[
// {
// 	"id": 111,
// 	"title": 'title11',
//     "journal": '期刊11', //期刊号
//     "author": "author1",
//     "state": "0", // 0->未发布 1->已发布
//     "tag": ['tag111', 'tag3333'],
//     "channel":222,
//     "create_time":"1441961734959",
//     "update_time":"1442238511933"
// },
// {
// 	"id": 112,
// 	"title": 'title22',
//     "journal": '期刊22', //期刊号
//     "author": "author22",
//     "state": "0", // 0->未发布 1->已发布
//     "tag": ['tag222', 'tag22222'],
//     "channel":222,
//     "create_time":"1441961734959",
//     "update_time":"1442238511933"
// },
// {
// 	"id": 113,
// 	"title": 'title33',
//     "journal": '期刊133', //期刊号
//     "author": "author133",
//     "state": "1", // 0->未发布 1->已发布
//     "tag": ['tag333', 'tag33333'],
//     "channel":333,
//     "create_time":"1441961734959",
//     "update_time":"1442238511933"
// },
// {
// 	"id": 114,
// 	"title": 'title44',
//     "journal": '期刊144', //期刊号
//     "author": "author144",
//     "state": "1", // 0->未发布 1->已发布
//     "tag": ['tag44', 'tag4444'],
//     "channel":333,
//     "create_time":"1441961734959",
//     "update_time":"1442238511933"
// },
// ];

const get={
    magazines:function(req,res,next){
        let channelId = req.params.id;
        if(!!channelId) {
            Magazine.find({isDelete: false, channel: channelId}, function (err, results){
                if(err) {
                    res.send({status: 'error', message: 'DB error'});
                    logger.mongo.bind('Mongodb error:', err);
                }else {
                    Channel.findOne({_id: channelId, isDelete: false}, function (err, result) {
                        if (err) {
                            res.send({status: 'error', message: 'Mongodb error:'});
                            logger.mongo.bind('Mongodb error:', err);
                        }else {
                            res.send({status: 'success',magazines:results,channelName:result.name})
                        }
                    });
                }
            }).sort({'create_time':1});
        } else {
            res.send({status: 'error', message: 'Lack of channelID'});
        }
    }
};

const post={
    magazine:function (req,res,next){
        let magazine = req.params || {};
        // if(typeof(magazine.tag) != 'object') {
        // 	magazine.tag = JSON.parse(magazine.tag);
        // }
        Magazine.create(magazine, function (err) {
            if(err) {
                res.send({status: 'error', message: 'DB error'});
                logger.mongo.bind('Mongodb error:', err);
            }
            else res.send({status: 'success'});
        });
    },
    copymagazines:function (req,res,next){

        console.log('id-->',req.params.id)

        let magazine={}
        let newMagazineId=''
        let pageList=[]
        async.series([
            function(done){
                //找到Magazine 信息
                Magazine.find({isDelete: false,_id: req.params.id}, function (err, results){
                    if(err) {
                        res.send({status: 'error', message: 'DB error'});
                        logger.mongo.bind('Mongodb error:', err);
                        return;
                    }else {
                        magazine.author=results[0].author;
                        magazine.backgroundAudio=results[0].backgroundAudio;
                        magazine.title=results[0].title+'【副本】';
                        magazine.copyright=results[0].copyright;
                        magazine.tag=results[0].tag;
                        magazine.channel=results[0].channel;
                        magazine.pageList=[];
                        pageList=results[0].pageList
                        done()
                    }})
            },
            //创建一个复制的Magazine信息
            function(done){
                Magazine.create(magazine, function (err,result) {
                    if(err) {
                        res.send({status: 'error', message: 'DB error'});
                        logger.mongo.bind('Mongodb error:', err);
                        return;
                    }else {
                        newMagazineId=result._id
                        done()
                    }})
            },
            //找到 所有的pagelist
            function(done){
                //没有页面的情况处理
                var plist=[]
                if(pageList.length==0){
                    magazine.pageList=plist
                    Magazine.update({_id: result._id}, magazine, function (err,result) {
                        if(err) {
                            res.send({status: 'error', message: 'Mongodb error'});
                            logger.mongo.bind('Mongodb error:', err);
                            return;
                        }else{
                            res.send({status: 'success'});
                        }
                    })
                    return;
                }

                //循环 做数据
                async.forEachSeries(pageList,function(item,callback){

                    Page.findOne({_id:item}, function(err, pageResult){
                        if(err) {
                            res.send({status: 'error', message: 'Mongodb error'});
                            logger.mongo.bind('Mongodb error:', err);
                            return;
                        }else{
                            var page={}
                            page.name=pageResult.name
                            page.content=pageResult.content
                            page.magazine=newMagazineId;
                            Page.create(page, function(err, re){
                                if(err) {
                                    res.send({status: 'error', message: 'Mongodb error'});
                                    logger.mongo.bind('Mongodb error:', err);
                                    return;
                                }else{
                                    plist.push(re._id)
                                }
                                callback();
                            });
                        }})

                },function(){

                    magazine.pageList=plist
                    Magazine.update({_id: newMagazineId}, magazine, function (err,result) {
                        if(err) {
                            res.send({status: 'error', message: 'Mongodb error'});
                            logger.mongo.bind('Mongodb error:', err);
                        }else{
                            res.send({status: 'success'});
                        }

                        return;
                    })
                })
            }
        ],function(error){
            //返回信息
        })
    }

};

const put={
    magazine:function(req,res,next){
        let magazine = req.params || {};
        // if(typeof(magazine.tag) != 'object') {
        // 	magazine.tag = JSON.parse(magazine.tag);
        // }
        if(!!magazine._id) {
            Magazine.update({_id: magazine._id}, magazine, (err) => {
                if(err){
                res.send({status: 'error', message: 'DB error'});
                logger.mongo.bind('Mongodb error:', err);
            }
        else res.send({status: 'updateSuccess'});
        })
    } else {
        res.send({status: 'error', message: 'Lack of magazineID'});
}

}

}

const del={
    magazine:function(req,res,next){
        Magazine.update({_id: req.params.id, isDelete: false}, { $set: { isDelete: true } }, { runValidators: true }, function (err, num) {

            if(num === 0) {
                res.send({status: 'error', message: 'magazine not exist'});
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


export {get, post, put, del};