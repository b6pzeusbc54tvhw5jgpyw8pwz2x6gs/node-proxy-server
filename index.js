const _ = require('underscore');
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const port = process.env.PORT;

const mapInfoList = [
  { host: 'localhost', target: 'http://localhost:3081' },
  { host: 'pc.localhost', target: 'http://localhost:3015' }
];

const server = http.createServer( function( req, res ) {

  const mapInfo = _.findWhere( mapInfoList, { host: req.headers.host });

  if( ! mapInfo ) {
    return;
  }

  proxy.web( req, res, { target: mapInfo.target });
});

server.listen( port );

console.log('mapInfoList: ')
console.log( JSON.stringify( mapInfoList, null, 2) );
console.log('proxy-server now listen to port: ' + port );
