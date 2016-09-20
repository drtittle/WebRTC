/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
// DT var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
// DTvar app = express();

// serve the files out of ./public as our main files
// DT app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function()
//{
//  // print a message when the server starts listening
//  console.log("server starting on " + appEnv.url + ":" + appEnv.port);
//});

var isUseHTTPs = false; 

var server = require(isUseHTTPs ? 'https' : 'http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');


/*
function serverHandler(request, response)
{
    var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

    response.writeHead(200, {
         'Content-Type': 'text/plain'
    });
    response.write('Hi there from a Custom Bluemix RTC Server over Node.js and Socket.io' + path.join('/', uri) + '\n');
    response.end();
    return;
}
*/


function serverHandler(request, response)
{
    var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);
    var stats;

    try
    {
        stats = fs.lstatSync(filename);
    }
    catch (e)
    {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
        response.end();
        return;
    }

    if (fs.statSync(filename).isDirectory())
    {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });

        if (filename.indexOf('/demos/MultiRTC/') !== -1)
        {
            filename = filename.replace('/demos/MultiRTC/', '');
            filename += '/demos/MultiRTC/index.html';
        }
        else if (filename.indexOf('/demos/') !== -1)
        {
            filename = filename.replace('/demos/', '');
            filename += '/demos/index.html';
        }
        else
        {
            filename += '/demos/index.html';
        }
    }


    fs.readFile(filename, 'utf8', function(err, file)
    {
        if (err)
        {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        try
        {
            var demos = (fs.readdirSync('demos') || []);
            if (demos.length)
            {
                var h2 = '<h2 style="text-align:center;display:block;"><a href="https://www.npmjs.com/package/rtcmulticonnection-v3"><img src="https://img.shields.io/npm/v/rtcmulticonnection-v3.svg"></a><a href="https://www.npmjs.com/package/rtcmulticonnection-v3"><img src="https://img.shields.io/npm/dm/rtcmulticonnection-v3.svg"></a><a href="https://travis-ci.org/muaz-khan/RTCMultiConnection"><img src="https://travis-ci.org/muaz-khan/RTCMultiConnection.png?branch=master"></a></h2>';
                var otherDemos = '<section class="experiment" id="demos"><details><summary style="text-align:center;">Check ' + (demos.length - 1) + ' other RTCMultiConnection-v3 demos</summary>' + h2 + '<ol>';
                demos.forEach(function(f) {
                    if (f && f !== 'index.html' && f.indexOf('.html') !== -1) {
                        otherDemos += '<li><a href="/demos/' + f + '">' + f + '</a> (<a href="https://github.com/muaz-khan/RTCMultiConnection/tree/master/demos/' + f + '">Source</a>)</li>';
                    }
                });
                otherDemos += '<ol></details></section><section class="experiment own-widgets latest-commits">';

                file = file.replace('<section class="experiment own-widgets latest-commits">', otherDemos);
            }
        }
        catch (e) 
        {}


        response.writeHead(200);
        response.write(file, 'utf8');
        response.end();
    });
}

//var app = server.createServer(serverHandler);
var app = server.createServer();

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));
app.use(path.join(__dirname + '/public'));


app.listen(appEnv.port, '0.0.0.0', function()
{
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url + ":" + appEnv.port);
});

require('./node_modules/rtcmulticonnection-v3/Signaling-Server.js')(app, function(socket)
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



/*
// Muaz Khan      - www.MuazKhan.com
// MIT License    - www.WebRTC-Experiment.com/licence
// Documentation  - github.com/muaz-khan/RTCMultiConnection

var isUseHTTPs = false && !(!!process.env.PORT || !!process.env.IP);

var port = process.env.PORT || 9001;

try
{
    var _port = require('./config.json').port;

    if (_port && _port.toString() !== '9001')
    {
        port = parseInt(_port);
    }
}
catch (e)
{
	
}

var server = require(isUseHTTPs ? 'https' : 'http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
*/


/*
function serverHandler(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
        response.end();
        return;
    }

    if (fs.statSync(filename).isDirectory()) {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });

        if (filename.indexOf('/demos/MultiRTC/') !== -1) {
            filename = filename.replace('/demos/MultiRTC/', '');
            filename += '/demos/MultiRTC/index.html';
        } else if (filename.indexOf('/demos/') !== -1) {
            filename = filename.replace('/demos/', '');
            filename += '/demos/index.html';
        } else {
            filename += '/demos/index.html';
        }
    }


    fs.readFile(filename, 'utf8', function(err, file) {
        if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        try {
            var demos = (fs.readdirSync('demos') || []);

            if (demos.length) {
                var h2 = '<h2 style="text-align:center;display:block;"><a href="https://www.npmjs.com/package/rtcmulticonnection-v3"><img src="https://img.shields.io/npm/v/rtcmulticonnection-v3.svg"></a><a href="https://www.npmjs.com/package/rtcmulticonnection-v3"><img src="https://img.shields.io/npm/dm/rtcmulticonnection-v3.svg"></a><a href="https://travis-ci.org/muaz-khan/RTCMultiConnection"><img src="https://travis-ci.org/muaz-khan/RTCMultiConnection.png?branch=master"></a></h2>';
                var otherDemos = '<section class="experiment" id="demos"><details><summary style="text-align:center;">Check ' + (demos.length - 1) + ' other RTCMultiConnection-v3 demos</summary>' + h2 + '<ol>';
                demos.forEach(function(f) {
                    if (f && f !== 'index.html' && f.indexOf('.html') !== -1) {
                        otherDemos += '<li><a href="/demos/' + f + '">' + f + '</a> (<a href="https://github.com/muaz-khan/RTCMultiConnection/tree/master/demos/' + f + '">Source</a>)</li>';
                    }
                });
                otherDemos += '<ol></details></section><section class="experiment own-widgets latest-commits">';

                file = file.replace('<section class="experiment own-widgets latest-commits">', otherDemos);
            }
        } catch (e) {}

        try {
            var docs = (fs.readdirSync('docs') || []);

            if (docs.length) {
                var html = '<section class="experiment" id="docs">';
                html += '<h2><a href="#docs">Documentation</a></h2>';
                html += '<ol>';

                docs.forEach(function(f) {
                    html += '<li><a href="https://github.com/muaz-khan/RTCMultiConnection/tree/master/docs/' + f + '">' + f + '</a></li>';
                });

                html += '</ol></section><section class="experiment own-widgets latest-commits">';

                file = file.replace('<section class="experiment own-widgets latest-commits">', html);
            }
        } catch (e) {}

        response.writeHead(200);
        response.write(file, 'utf8');
        response.end();
    });
}
*/

/*
var app;

if (isUseHTTPs)
{
    var options = {
        key: fs.readFileSync(path.join(__dirname, 'fake-keys/privatekey.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'fake-keys/certificate.pem'))
    };
    app = server.createServer(options, serverHandler);
}
else
	app = server.createServer(serverHandler);

app = app.listen(port, process.env.IP || '0.0.0.0', function()
{
    var addr = app.address();

    if (addr.address === '0.0.0.0')
    {
        addr.address = 'localhost';
    }

    console.log('Server listening at ' + (isUseHTTPs ? 'https' : 'http') + '://' + addr.address + ':' + addr.port);
});


require('./Signaling-Server.js')(app, function(socket)
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
*/