const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url.indexOf('/hijacked_wechat_index.js') !== -1) {
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-javascript; charset=utf-8'}
        );
        var original = decodeURIComponent(req.url.split('original=')[1]);
        res.write(`window.wechatOriginalScript="${original}";\n`, 'utf-8');
        return res.end(fs.readFileSync(path.join(__dirname, 'wechat_injection.js'), 'utf-8'));
    } 

    return res.end(req.url);
});

server.listen(8000);