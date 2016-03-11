import mongoose from 'mongoose';
import config from '../../config.json';
import logger from 'winston';

let host = process.env.MONGO_PORT_27017_TCP_ADDR ? process.env.MONGO_PORT_27017_TCP_ADDR : 'localhost';

mongoose.connect('mongodb://' + host + '/' + config.db.name, function (err) {
  if (err) {
    logger.mogno('Connect to database[%s] error: ', config.db.name, err.message);
    process.exit(1);
  } else {
  	logger.info('Connected to','mongodb://' + host + '/' + config.db.name);
  }
});


import {Channel} from './channel';
import {Magazine} from './magazine';
import {Page} from './page';
import {Template} from './template';
import {Imgmap} from './imgmap';
import {Audio} from './audio';
import {Video} from './video';

export {Channel, Magazine, Page, Template, Imgmap, Audio, Video};

