const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url.indexOf('/hijacked_wechat_index.js') !== -1) {
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-javascript; charset=utf-8'}
        );
        res.write(fs.readFileSync('./wechat_injection.js', 'utf-8'));
        res.end(fs.readFileSync('./hijacked_wechat_index.js', 'utf-8'));
    } else {
        res.end(req.url);
    }
});

server.listen(8000);