console.log('### wechat index js hijacked ###');

(function injectCodeToAngularApp() {
    var angular = window.angular;
    var originalBootstrap = angular.bootstrap;
    angular.bootstrap = function (element, moduleNames) {
        var ModuleName = 'webwxApp';
        angular.module(ModuleName).run(['$rootScope', function ($rootScope) {
            $rootScope.$on('root:pageInit:success', function () {
                $rootScope.$on("message:add:success", function (e, oMessage) {
                    conversationLogger(oMessage);
                });

                var injector = angular.element(document).injector();
                var chatFactory = injector.get('chatFactory');
                var originalMessageProcess = chatFactory.messageProcess;
                chatFactory.messageProcess = function (oMessage) {
                    originalMessageProcess.call(chatFactory, oMessage);
                    pingPongRobot(oMessage);
                }
            });
        }]);
        return originalBootstrap.apply(angular, arguments);
    }

    function conversationLogger(oMessage){
        console.log('### new conversation message: ', JSON.stringify(oMessage, null, 3));
    }

    function pingPongRobot (receivedMessage) {
        console.log('### message reveived, processing it ', JSON.stringify(receivedMessage, null, 3));

        var myName = $('.header .avatar').scope().account.UserName;
        if (receivedMessage.FromUserName !== myName) {
            var content = receivedMessage.Content.trim().toLowerCase();
            var toUser = window._contacts[receivedMessage.FromUserName];
            if (toUser.isRoomContact()) {
                content = content.split(':<br/>')[1];
            }
            switch (content) {
                case 'ping':
                    replyTo(toUser, 'pong');
                    break;
                case 'pingping':
                    replyTo(toUser, 'pongpong');
                    break;
                case 'pingpingping':
                    replyTo(toUser, 'pongpongpong');
                    break;
                default:
                    break;
            }
        }
    }

    function replyTo (toUser, message) {
        requestAnimationFrame(function(){
            $('.chat_list .chat_item').each(function(){
                if ($(this).scope().chatContact.UserName === toUser.UserName) {
                    $(this).click();
                    $('#editArea').html(message).trigger('input');
                    $('.action .btn.btn_send').click();
                }
            });
        });
    }

})();