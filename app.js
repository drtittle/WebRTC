/*eslint-env node*/

//------------------------------------------------------------------------------
// WebRTC starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve our custom files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// mount a 'virtual path' to point at our added node packages so Express will resolve
app.use('/node_modules/rtcmulticonnection-v3', express.static(__dirname + '/node_modules/rtcmulticonnection-v3'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function() {
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url + ":" + appEnv.port);
});


// David Tittle
// Adding an attachment for socket broadcasting
require('./node_modules/rtcmulticonnection-v3/Signaling-Server.js')(server, function(socket)
{
    try
    {
        var params = socket.handshake.query;

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });
        if (!params.socketCustomEvent)
        {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message)
        {
            try
            {
                socket.broadcast.emit(params.socketCustomEvent, message);
            }
            catch (e)
            {
            	
            }
        });
    }
    catch (e)
    {
    }
});
