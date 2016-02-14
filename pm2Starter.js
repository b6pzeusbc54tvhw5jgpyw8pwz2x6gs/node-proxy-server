#!/usr/bin/env node

const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const syncExec = require('sync-exec');
const readlinkSync = require('graceful-readlink').readlinkSync;
const argv = require('yargs').argv;

//const ERROR_EXIT = 1;
//const SUCCESS_EXIT = 0;

var ENV;
if( argv.stg ) ENV = 'STG';
else if( argv.prd ) ENV = 'PRD';
else ENV = 'DEV';

const processName = "proxy-server" + ENV;

const cwd = path.resolve( __dirname );
const syncExecOptions = {
	stdio: [ process.stdin, process.stdout, process.stderr ],
	cwd: cwd
};

//
// find global pm2
//
var globalPm2Path;
(function() {
	var res = syncExec('which pm2');
	var maybeSymlinkPath = ( res.stdout || '' ).replace( /\n$/,'' );
	if( maybeSymlinkPath ) {
		globalPm2Path = readlinkSync( maybeSymlinkPath );
	}

	if( globalPm2Path && ! /^\//.test( globalPm2Path ) ) {
		globalPm2Path = path.join( path.dirname(maybeSymlinkPath), globalPm2Path);
	} else if( globalPm2Path ) {
	} else {
	}
}());

var conf = {
	common: {
		cwd: cwd,
		script: path.resolve('index.js'),
		name: processName,
		log_date_format: "YYYY-MM-DD HH:mm Z",

		//"instances": 1, //or 0 => 'max'
		min_uptime: "10s", // defaults to 15
		max_restarts: 3, // defaults to 15

		error_file: path.join( process.env.HOME,'.pm2','logs', processName+'.log' ),
		out_file: path.join( process.env.HOME,'.pm2','logs', processName+'.log' ),

		merge_logs: true
	},

	DEV: {
		watch: ['src'],
		env: {
			//"NODE_TLS_REJECT_UNAUTHORIZED": "0"
			PORT: 3010,
			NODE_ENV: "development"
		}
	},

	STG: {
		env: {
			PORT: 3015,
			NODE_ENV: "staging"
		}
	},

	PRD: {
		env: {
			PORT: 3080,
			NODE_ENV: "production"
		}
	}
};

const pm2Conf = _.extend( {}, conf.common, conf[ ENV ] );
console.log( pm2Conf );

_.each( pm2Conf.env, function( val ) {

	if( typeof val === 'string' ) return;

	// parse test
	try{
		JSON.parse( val );
	} catch( err ) {
		console.error( err );
	}
});

const processJsonPath = path.join(__dirname,'_process.json');
fs.writeFileSync( processJsonPath, JSON.stringify( pm2Conf, null, 2 ));

var cmd;
if( argv.start ) {

	cmd = globalPm2Path + " start " + processJsonPath;
	console.log( cmd );
	syncExec( cmd, syncExecOptions );
}
