const _ = require('underscore');
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const port = process.env.PORT;

const domainInfo = require('./domainInfo.json');
const mappingList = domainInfo.mappingList;

const server = http.createServer( function( req, res ) {

  const mapInfo = _.findWhere( mappingList, { host: req.headers.host });

  if( ! mapInfo ) {
    return;
  }

  proxy.web( req, res, { target: mapInfo.target });
});

server.listen( port );

console.log('mappingList: ')
console.log( JSON.stringify( mappingList, null, 2) );
console.log('proxy-server now listen to port: ' + port );
