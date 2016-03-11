const _ = require('underscore');
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
var httpPort = process.env.HTTP_PORT;
var httpsPort = process.env.HTTPS_PORT;

const domainInfo = require('./domainInfo.json');
const mappingList = domainInfo.mappingList;

var proxyService = function( req, res ) {

  var mapInfo = _.findWhere( mapInfoList, { host: req.headers.host });
  if( ! mapInfo ) {
    return;
  }
  proxy.web( req, res, { target: mapInfo.target });
}

const httpsOptions = {
	key: fs.readFileSync('./ssl/host.key'),
	cert: fs.readFileSync('./ssl/host.crt'),
	ca: fs.readFileSync('./ssl/rootCA.crt')
};

var httpServer = http.createServer( proxyService );
var httpsServer = https.createServer( proxyService );
httpServer.listen( httpPort );
httpsServer.listen( httpsOptions, httpsPort );

console.log('mappingList: ')
console.log( JSON.stringify( mappingList, null, 2) );
console.log('proxy-server now listen to port: ' + httpPort );
console.log('proxy-httpsServer now listen to port: ' + httpsPort );
