'use strict'

import restify from 'restify';
import logger from 'winston';
import * as route from './route';
import config from '../config.json';
import fs_extra from 'fs-extra';
import os from 'os';

let server = restify.createServer();

/*文件上传*/
server.use(restify.bodyParser({
  maxBodySize: 1024 * 1024 * 1024,
  mapParams: true,
  mapFiles: false,
  overrideParams: false,
  keepExtensions: true,
  uploadDir: process.cwd() + '/upload/tmp',
  multiples: true
}));

/**
 * 跨域
 */
server.use(restify.CORS());
server.use(restify.fullResponse());

logger.add(logger.transports.File, {
	filename:'server.log',
	json:false,
	level:'info'
});

/*init folders*/
if(!fs_extra.existsSync(process.cwd() + config.upload.path + config.upload.tmp)) {
	fs_extra.mkdirsSync(process.cwd() + config.upload.path + config.upload.tmp);
}

if(!fs_extra.existsSync(process.cwd() + config.upload.path + config.upload.img)) {
	fs_extra.mkdirsSync(process.cwd() + config.upload.path + config.upload.img);
}



//config.host = os.type() === 'Darwin' ? 'http://localhost:3000' : 'http://magazine.dev.selcome.com';



server.listen(3000, function() {
	logger.info('%s listening at %s', server.name, server.url);
});

/**
 * 版式接口
 */
// 获取所有版式
// curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/templates
//http://magazine.dev.selcome.com/dev/api/templates
server.get('/api/templates', route.templates.get.templates);
// 获取指定页面版式
//curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/template/1
//http://magazine.dev.selcome.com/dev/api/template/1
server.get('/api/template/:id',route.templates.get.template);
//新增版式
server.post('/api/template',route.templates.post.template);
//添加缩略图
server.post('/api/thumbnail',route.templates.post.thumbnail1)
//删除模板
server.del('/api/template/:id',route.templates.del.template)


/**
 * 页面列表接口
 */
 // 获取页面列表
// curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/pageList/231
//http://magazine.dev.selcome.com/dev/api/pageList/231
server.get('/api/pageList/:id', route.pageList.get.pageList);
// 获取页面内容
//curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/page/99
//http://magazine.dev.selcome.com/dev/api/page/99
server.get('/api/page/:id', route.pageList.get.page);
// 更新页面内容
//curl -H "Content-Type: application/json" -X PUT  http://localhost:3000/api/page/231
//http://magazine.dev.selcome.com/dev/api/page/99 (name=1111)
server.put('/api/page/:id',route.pageList.put.page);
// 创建新的页面
//curl -H "Content--X POST -d '{"name":"231"}' http://localhost:3000/api/page
//http://magazine.dev.selcome.com/dev/api/page
server.post('/api/page', route.pageList.post.newPage);
// 删除页面
//curl -H "Content--X DELETE http://localhost:3000/api/page/231
server.del('/api/page/:magazine/:id', route.pageList.del.page);
//更新页面顺序
//curl -H "Content-Type: application/json" -X PUT  http://localhost:3000/api/page/sort/231/5
//http://localhost:3000/api/page/sort/231/5
server.put('/api/page/sort/:magazine/:id/:pos', route.pageList.put.order);
//更新页面的name
//curl -H "Content-Type: application/json" -X PUT -d '{"id":99,"name":"建立基本知识","content":""}' http://localhost:3000/api/page
server.put('/api/page', route.pageList.put.pageItem);


/**
 *频道相关接口
 *
 */
//获取所以频道
//curl -H "Content-Type: application/XML" -X GET http://localhost:3000/api/channels
server.get('/api/channels',route.channels.get.channels);
//新增频道
//curl -H "Content-Type: application/json" -X POST -d '{"name":"123456"}' http://localhost:3000/api/channel
server.post('/api/channel',route.channels.post.channel);
//编辑频道
//curl -H "Content-Type: application/json" -X PUT -d '{"id":"111","name":"123456"}' http://localhost:3000/api/channel
server.put('/api/channel',route.channels.put.channel);
//删除频道
//curl -H "Content-Type: application/json" -X DELETE  http://localhost:3000/api/channel/111
server.del('/api/channel/:id',route.channels.del.channel);



/**
 * 期刊相关接口
 */
//获取指定频道下的所有期刊
server.get('/api/magazines/:id', route.magazines.get.magazines);
//新增期刊
server.post('/api/magazine', route.magazines.post.magazine);

//拷贝期刊
server.post('/api/copy/magazines', route.magazines.post.copymagazines)

//编辑期刊
server.put('/api/magazine', route.magazines.put.magazine);
//删除期刊
server.del('/api/magazine/:id', route.magazines.del.magazine);





/**
 * 图片列表接口
 */
// 加载所有图片
//curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/imageList
server.get('/api/imageList', route.images.get.imageList);
//获取图片
server.get('/upload/image_sources/:id', route.images.get.image_sources);
//上传图片
//
server.post('/api/upload/image',route.images.post.image);
//删除图片
//curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/api/image/10
server.del('/api/image/:id', route.images.del.image);


/**
 * 音频列表接口
 */
// 加载所有音频
server.get('/api/audioList', route.audios.get.audioList);
//新增音频
server.post('/api/audio', route.audios.post.audio);
//删除音频
server.del('/api/audio/:id', route.audios.del.audio);


/**
 * 视频列表接口
 */
// 加载所有视频
server.get('/api/videoList', route.videos.get.videoList);
//新增视频
server.post('/api/video', route.videos.post.video);
//删除视频
server.del('/api/video/:id', route.videos.del.video);


/**
 * 发布的接口列表
 */
server.put('/api/release',route.release.put.make)



























