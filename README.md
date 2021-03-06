# tiny-wechat-robot
使用 code hijack 和 code injection ( [phantomjs_wechat.js](src/phantomjs_wechat.js) ) 来实现一个简单的微信机器人应用。

## 用法:
1. 确保 PhantomJS([ref](http://phantomjs.org/api/webpage/handler/on-resource-requested.html)) 在系统路径`PATH`上 
2. `npm run serve`
3. `npm run wechat` (新开一个 Terminal Tab执行这个命令)
4. 根据命令行提示信息，扫二维码登陆微信
5. 发一个 `ping` 测试信息给当前登录用户，应该会自动收到一个 `pong` 应答

Tested with `node v7.7.3` and `PhantomJS V 2.1.1`: [phantomjs-2.1.1-macosx.zip ](https://npm.taobao.org/mirrors/phantomjs/phantomjs-2.1.1-macosx.zip) or [phantomjs-2.1.1-linux-x86_64.tar.bz2  ](https://npm.taobao.org/mirrors/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2)

## 核心功能
目前就是一个最简化的`ping-pong`应答机器人 (核心代码是 [wechat_injection.js](src/wechat_injection.js) )，给`当前登录用户`发消息，则: 
1. 收到`ping`，回复`pong`；
2. 收到`pingping`，回复`pongpong`；
3. 收到`pingpingping`，回复`pongpongpong`；
4. 其他，不做特殊处理。

## 设计思路
1. 使用 phantomjs 访问微信 web 登录页面；
2. 劫持脚本： https://res.wx.qq.com/a/wx_fed/webwx/res/static/js/index_c7d281c.js （这个脚本的版本号可能会变更）通过 phantomjs `networkRequest.changeUrl()` 把脚本请求转发为本机脚本 wechat_injection.js；
3. [wechat_injection.js](src/wechat_injection.js) 中重载`angular.bootstrap`并且挂载自定义的 hook，从而可以监听微信聊天信息。同时在脚本的最后再加载并且执行原始的微信 index js，需要针对特殊的 ECMA 语言特性做特殊处理（目前只有一个 `let` 会有问题，已经替换为 `var`）。
4. 根据自定义规则做自动应答。

## 如何调试？
使用任意 proxy 代理软件，如 Charles Proxy，或者chrome浏览器插件[trumpet](https://chrome.google.com/webstore/detail/trumpet/cflekmkldaldnelemkkldoaedapbkmog) 转发资源请求。
- 需要注意 [wechat_injection.js](src/wechat_injection.js) 中 `loadOriginalScript()` 在 Chrome 中会遇到跨域请求限制问题，可以直接修改代码，把原始 script 下载后添加到该文件中即可。 
