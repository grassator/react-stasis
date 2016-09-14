const app = require('./app');
const stasisServer = require('../server');
const fs = require('fs');

//Lets require/import the HTTP module
const http = require('http');

//Lets define a port we want to listen to
const PORT = 8080;

function serveJs(response, file) {
    response.setHeader('content-type', 'text/javascript');
    response.end(fs.readFileSync(__dirname + '/' + file));
}

//We need a function which handles requests and send response
function handleRequest(request, response) {
    if (request.url === '/app.js') {
        serveJs(response, 'app.js');
    } else if (request.url === '/react-stasis.js') {
        serveJs(response, '../index.js');
    } else {
        response.write('<html><head><title>React Stasis Example</title></head><body><div id="root">');
        response.write(stasisServer.renderToString(app([
            'one',
            'two',
            'three'
        ])));
        response.write(
            '<script src="https://unpkg.com/react@15.3.1/dist/react.js"></script>' +
            '<script src="https://unpkg.com/react-dom@15.3.1/dist/react-dom.js"></script>' +
            '<script src="react-stasis.js"></script>' +
            '<script src="app.js"></script>' +
            '<script>ReactStasis.render(App(), document.getElementById("root"));</script>'
        );
        response.end('</div></body></html>');
    }
}

//Create a server
const server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
