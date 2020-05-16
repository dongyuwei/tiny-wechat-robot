var webPage = require('webpage');
var page = webPage.create();

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';
page.clearMemoryCache();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

var redirected = {};
page.onResourceRequested = function(requestData, networkRequest) {
    var url = requestData.url;
    if (!redirected[url] && url.match(/wx.qq.com\/a\/wx_fed\/webwx\/res\/static\/js\/index_(.+)\.js$/)) {
        redirected[url] = true;
        console.log('>>> onResourceRequested', url)
        networkRequest.changeUrl(
          "http://127.0.0.1:8000/hijacked_wechat_index.js?v=" +
            new Date().getTime() +
            "&original=" +
            encodeURIComponent(url)
        );
    }

    if (url.indexOf('/qrcode/') !== -1) {
        console.info('\n############################################################################');
        console.info('1. 请使用浏览器打开二维码图片 ' + url +  '\n2. 用手机微信扫码登陆。');
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

page.open('https://wx2.qq.com/?&lang=en_US', function(status) {
    console.log('Status: ' + status);
});