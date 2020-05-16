# tiny-wechat-robot
使用 code hijack 和 code injection ( [phantomjs_wechat.js](src/phantomjs_wechat.js) ) 来实现一个简单的微信机器人应用。

## usage:
1. make sure PhantomJS([ref](http://phantomjs.org/api/webpage/handler/on-resource-requested.html)) in your `PATH`
2. `npm run serve`
3. `npm run wechat`
4. 扫码登陆微信

Tested with `node v7.7.3` and `PhantomJS V 2.1.1`: [phantomjs-2.1.1-macosx.zip ](https://npm.taobao.org/mirrors/phantomjs/phantomjs-2.1.1-macosx.zip) or [phantomjs-2.1.1-linux-x86_64.tar.bz2  ](https://npm.taobao.org/mirrors/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2)

## 核心功能
目前就是一个最简化的`ping-pong`应答机器人 (核心代码是 [wechat_injection.js](src/wechat_injection.js) )，给`当前登录用户`发消息，则: 
1. 收到`ping`，回复`pong`；
2. 收到`pingping`，回复`pongpong`；
3. 收到`pingpingping`，回复`pongpongpong`；
4. 其他，不做特殊处理.
