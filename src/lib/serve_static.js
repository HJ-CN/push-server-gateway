import mime from 'mime';
import path from 'path';
import fs from 'fs';
import {logger} from '../logConfig.js';

function serve_static(req, res, file, isGzip) {
	if(isGzip) {
		res.send({status: 'error', message: 'Only support simple file.'});
	} else {
		let file_path = path.normalize(file).replace(/\\/g, '/');
		fs.stat(file_path, (err, stats) => {
			if(err) {
				res.send({status: 'error', message: 'Internal server error'});
				logger.error(err);
			}

			if(!stats.isFile()) {
				res.send({status: 'error', message:  file_path + 'is not exist'});
			}

		 	let fstream = fs.createReadStream(file_path);
      let maxAge = 3600;
      fstream.once('open', function (fd) {
          res.cache({maxAge: maxAge});
          res.set('Content-Length', stats.size);
          res.set('Content-Type', mime.lookup(file_path));
          res.set('Last-Modified', stats.mtime);
          res.writeHead(200);
          fstream.pipe(res);
          fstream.once('end', () => {
              next(false);
          });
      });
		});
	}
}

export {serve_static};