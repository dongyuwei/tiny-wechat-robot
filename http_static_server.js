const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url === '/hijacked_wechat_index.js') {
        fs.readFile('./hijacked_wechat_index.js', 'utf-8', function(err, content){
            res.writeHead(200, {
                'Content-Type': 'application/x-javascript; charset=utf-8' });
            res.end(content);
        });
    } else {
        res.end(req.url);
    }
});

server.listen(8000);