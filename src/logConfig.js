import fs from 'fs';
import tracer from 'tracer';
import colors from 'colors';
import config from '../config.json';

const logDir = process.cwd() + '/log';

const logRecordGrade = 4; //0-> log 4->warn 5->error

let loggerMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error', 'mongo', 'http'];

const colorsTheme = {
  log: 'white',
  trace: 'cyan',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  mongo: 'gray',
  http: 'magenta'
};

/*init log directory*/
if(!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, 0o777, (err) => console.log(err));
}

for(let index in loggerMethods) {
	if(!fs.existsSync(logDir + '/' + loggerMethods[index])) {
		fs.mkdirSync(logDir + '/' + loggerMethods[index], 0o777, err => console.log(err));
	}
}

let logger = tracer.console({
	level: 0,
	format: [
   	'{{timestamp}} {{title}} [in {{file}}:{{line}}] {{message}}',
		{
			http: '{{timestamp}} {{message}}'
		} 
  ],
	dateformat: 'yyyy-mm-dd HH:MM:ss',
	methods: loggerMethods,
	transport: data => {
		try {
	    if (data.output[colorsTheme[data.title]]) console.log(data.output[colorsTheme[data.title]]);
	    else console.log(data.output);
	    if (data.level >= 5) {
        let logPath = logDir + '/' + data.title + '/' + data.timestamp.substring(0, 10) + '.log';
        fs.writeFile(logPath, data.output + '\n', {
        	encoding: 'utf8',
        	mode: 0o666,
        	// mode: 438,
        	flag: 'a'
        }, err => { if(err) console.log('Write log file:', err); });
	    }
		} catch (e) {
	    console.log('Logger error:', e);
    }
	}
});

export {logger};
