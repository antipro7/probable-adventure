$(function(){
    'use strict';

// 选中所有input[data-rule]
    var $inputs = $('[data-rule]');//选中要验证的input
    var $form = $('#signup');
    var inputs = [];
    
    //jquery的each方法
    $inputs.each(function(index,node){
        // 解析每一个input验证规则
        var tmp = new Input(node);
        inputs.push(tmp);
    })

    //console.log('inputs:',inputs);
    $form.on('submit',function(e){
        e.preventDefault();
        $inputs.trigger('blur');
        for(var i=0;i<inputs.length;i++){
            var item = inputs[i];
            var r = item.validator.is_valid();
            if(!r){
                alert('invalid');
                return;
            }
        }

        //signup();
        alert('valid');
    })

    function signup() {
        $.post(url,{
            name:'',

        })
    }

// 验证
/* var validator = new Validator('asdasd,asdasd.',{
        maxlength: 9,
        minlength: 2,
        pattern:'^[.,a-zA-Z0-9]*$',//*表示可以为空字符串，页面有判断不能为空，所以这里留*；+表示不可为空
    });
*/
    // var result = validator.validate_maxlength();
    // var result = validator.validate_minlength();
    // var result = validator.validate_numeric();
    // var result = validator.validate_nullable();
    // var result = validator.validate_pattern();
    // console.log('result',result);

    // var test = new Input('#test');
    // var valid = test.validator.is_valid();
    // console.log('valid:',valid);


    //创建一个连接，这里的参数是服务端的链接
    var socket = new WebSocket(url);
    
    function emit() {
        
        var text = $("#msg").val();
        var msg = {
            "message" : text,
            "color" : "#CECECE",
            "bubbleColor" : "#2E2E2E",
            "fontSize" : "14",
            "fontType" : "微软雅黑"
        };
        msg = JSON.stringify(msg);
        //向服务端发送消息
        socket.send(msg);
    
        //将自己发送的消息内容静态加载到html上，服务端实现自己发送的消息不会推送给自己
        $("#content").append("<kbd style='color: #" + "CECECE" + ";float: right;clear: right; font-size: " + 12 + ";'>" + text +  "</kbd><br/>");
        //将消息文本框清空
        $("#msg").val("");
    } 


    $(function() {
        //初始化加载listen方法
        listen();
    })
    
    function listen() {
        //打开连接时触发
        socket.onopen = function() {
            $("#content").append("<kbd>Welcome!</kbd></br>");
        };
        //收到消息时触发
        socket.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            $("#content").append("<kbd style='color: #" + data.color + ";font-size: " + data.fontSize + ";margin-top: 10px;'>" + data.userName + " Say: " + data.message + "</kbd></br>");
        };
        //关闭连接时触发
        socket.onclose = function(evt) {
            $("#content").append("<kbd>" + "Close!" + "</kbd></br>");
        }
        //连接错误时触发
        socket.onerror = function(evt) {
            $("#content").append("<kbd>" + "ERROR!" + "</kbd></br>");
        }
    }
    //按下回车键时触发发送消息方法
    document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode == 13){ // enter键
            emit();
        }
    };
    
});