/**
 * Created by wangjun on 16/1/4.
 */

'use strict'

import mongoose from 'mongoose';
import * as model from '../model';
import logger from 'winston';
let Magazine = model.Magazine;
import config from '../../config.json';
var request = require('superagent');

const put= {
    make: function (req, res, next) {
        var magazineId = req.params.id;
        if(!magazineId){
            res.send({ status: 'error', message: 'data error'});
            logger.mongo.bind('data error');
            return;
        }

        generator(magazineId,function(result){
            res.send(result)
        })

    }
}


function generator(magazineId,callback) {

    var url=config.releaseapiPath + magazineId
    request.get(url).end(function (error, response) {
        if (error) {
            console.error('load page list error: ' + error);
            callback({status: 'error', message: 'NetWork error'})
            return;
        }
        var props = response.body;
        if(props.status=='success'){
            Magazine.update({_id: magazineId}, { $set: { state: "1" } }, { runValidators: true }, function (err, num) {

                if(num === 0) {
                    callback({status: 'error', message: 'magazine not exist'});
                    return;
                }
                if(err) {
                    callback({status: 'error', message: 'Mongodb error'});
                    logger.mongo.bind('Mongodb error:', err);
                } else {
                    callback({status: 'success'})
                }
            });
        }else{
            callback({status: 'fail'})
        }
    });
}

export {put};
