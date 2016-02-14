var _ = require('underscore');
var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});
var port = process.env.PORT;

var mapInfoList = [
  { host: 'localhost', target: 'http://localhost:3081' },
  { host: 'pc.localhost', target: 'http://localhost:3015' }
];

var server = http.createServer( function( req, res ) {

  var mapInfo = _.findWhere( mapInfoList, { host: req.headers.host });

  if( ! mapInfo ) {
    return;
  }

  proxy.web( req, res, { target: mapInfo.target });
});

server.listen( port );

console.log('mapInfoList: ')
console.log( JSON.stringify( mapInfoList, null, 2) );
console.log('proxy-server now listen to port: ' + port );
