const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url.indexOf('/hijacked_wechat_index.js') !== -1) {
        fs.readFile('./hijacked_wechat_index.js', 'utf-8', function(err, content){
            res.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-javascript; charset=utf-8' });
            res.end(content);
        });
    } else {
        res.end(req.url);
    }
});

server.listen(8000);