// Create web server
// Load modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');

// Create web server
var server = http.createServer(function (request, response) {
    // Get requested URL
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;

    // Respond to GET method
    if (request.method == 'GET') {
        // Read file content
        if (resource == '/') {
            resource = '/comment.html';
        }
        var filePath = __dirname + resource;
        fs.readFile(filePath, 'utf-8', function (error, data) {
            if (error) {
                // Respond with error message
                response.writeHead(500, { 'Content-Type': 'text/html' });
                response.end('500 Internal Server Error');
            } else {
                // Respond with file contents
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    }
    // Respond to POST method
    else if (request.method == 'POST') {
        if (resource == '/comment') {
            // Read message data
            request.on('data', function (data) {
                var query = qs.parse(data.toString());
                var comment = query.comment;

                // Append message to file
                fs.appendFile('comment.txt', comment + '\n', 'utf-8', function (error) {
                    if (error) {
                        // Respond with error message
                        response.writeHead(500, { 'Content-Type': 'text/html' });
                        response.end('500 Internal Server Error');
                    } else {
                        // Redirect to main page
                        response.writeHead(302, { 'Location': '/' });
                        response.end();
                    }
                });
            });
        }
    }
});

// Start web server
server.listen(8080, function () {
    console.log('Server is listening...');
});