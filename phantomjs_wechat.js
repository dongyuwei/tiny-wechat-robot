var webPage = require('webpage');
var page = webPage.create();

page.onResourceRequested = function(requestData, networkRequest) {
    var url = requestData.url;
    console.log('request url: ', url);
    
    if (url.match(/static\/js\/index_(.+)\.js$/)) {
        networkRequest.changeUrl('http://127.0.0.1:8000/hijacked_wechat_index.js');
    }

    if (url.indexOf('/qrcode/') !== -1) {
        console.info("### qrcode: ", requestData.url);
        console.info('### 请用手机微信扫码登陆。### ');
    }
};

page.open('https://wx.qq.com/', function(status) {
    console.log('Status: ' + status);
});