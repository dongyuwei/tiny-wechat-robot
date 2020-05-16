var webPage = require('webpage');
var page = webPage.create();

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';
page.clearMemoryCache();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onResourceRequested = function(requestData, networkRequest) {
    var url = requestData.url;
    console.log("request ", url)
    if (url.match(/static\/js\/index_(.+)\.js$/)) {
        networkRequest.changeUrl('http://127.0.0.1:8000/hijacked_wechat_index.js?v=' + new Date().getTime());
    }

    if (url.indexOf('/qrcode/') !== -1) {
        console.info("### qrcode: ", url);
        console.info('### 请用手机微信扫码登陆。### ');
    }
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};

var indexUrl = 'https://wx.qq.com/';
page.open(indexUrl, function(status) {
    console.log('Status: ' + status + ' to load ' + indexUrl);
});