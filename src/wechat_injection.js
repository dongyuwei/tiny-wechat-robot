console.log("### wechat index js hijacked ###");

(function injectCodeToAngularApp() {
  var angular = window.angular;
  var originalBootstrap = angular.bootstrap;
  angular.bootstrap = function(element, moduleNames) {
    var ModuleName = "webwxApp";
    angular.module(ModuleName).run([
      "$rootScope",
      function($rootScope) {
        $rootScope.$on("root:pageInit:success", function() {
          $rootScope.$on("message:add:success", function(e, oMessage) {
            conversationLogger(oMessage);
          });

          var injector = angular.element(document).injector();
          var chatFactory = injector.get("chatFactory");
          var originalMessageProcess = chatFactory.messageProcess;
          chatFactory.messageProcess = function(oMessage) {
            originalMessageProcess.call(chatFactory, oMessage);
            pingPongRobot(oMessage);
          };
        });
      }
    ]);
    return originalBootstrap.apply(angular, arguments);
  };

  function conversationLogger(oMessage) {
    console.log(
      "### new conversation message: ",
      JSON.stringify(oMessage, null, 3)
    );
  }

  function pingPongRobot(receivedMessage) {
    console.log(
      "### message reveived, processing it ",
      JSON.stringify(receivedMessage, null, 3)
    );

    var content = receivedMessage.Content.trim().toLowerCase();
    var toUser = window._contacts[receivedMessage.FromUserName];
    if (toUser.isRoomContact()) {
      content = content.split(":<br/>")[1];
    }

    var myName = $(".header .avatar").scope().account.UserName;
    var toSelf = receivedMessage.FromUserName === myName;
    var reply = toSelf ? replyToSelf : replyTo;
    switch (content) {
      case "ping":
        reply("pong", toUser);
        break;
      case "pingping":
        reply("pongpong", toUser);
        break;
      case "pingpingping":
        reply("pongpongpong", toUser);
        break;
      default:
        reply(
          content
            .split("")
            .reverse()
            .join(""),
          toUser
        );
        break;
    }
  }

  function replyTo(message, toUser) {
    requestAnimationFrame(function() {
      $(".chat_list .chat_item").each(function() {
        if ($(this).scope().chatContact.UserName === toUser.UserName) {
          $(this).click();
          $("#editArea")
            .html(message)
            .trigger("input");
          $(".action .btn.btn_send").click();
        }
      });
    });
  }

  function replyToSelf(message) {
    console.log("replyToSelf", message);
    requestAnimationFrame(function() {
      $(".header .avatar img").click();
      $(".profile_mini .web_wechat_tab_launch-chat").click();
      $("#editArea")
        .html(message)
        .trigger("input");
      $(".action .btn.btn_send").click();
    });
  }

  (function loadOriginalScript() {
    var indexScript =
      "https://res.wx.qq.com/a/wx_fed/webwx/res/static/js/index_c7d281c.js";

    $.ajax({
      url: indexScript,
      dataType: "text",
      success: function(script, textStatus, jqxhr) {
        if (jqxhr.status === 200) {
          //phantomjs does not support ECMA6 language features
          script = script.replace(" let ", " var ");
          window.eval(script);
          console.log(indexScript + " loaded.");
        }
      }
    });
  })();
})();
