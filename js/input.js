$(function(){

    //input只是一个函数，想让它代表页面中某一个input，所以用选择器告诉他
    window.Input = function (selector) {
        var $ele,
            $error_ele,
            me = this,
            rule = {
                nullable: true
            };

        //规则解析完后，为了检测是否合法，把它传到validator
        this.load_validator = function() {
            var val = this.get_val();
            this.validator = new Validator(val,rule);
        }

        //rule和val 都要获取
        this.get_val = function() {
            return $ele.val();
        }

        function init() {
           find_ele();
           get_error_ele();
           parse_rule();
           me.load_validator();
           listen();
        }

        function listen() {
            $ele.on('blur',function(){
                var valid = me.validator.is_valid(me.get_val());
                //console.log('valid:',r);
                if(valid){
                     $error_ele.hide();
                 }else{
                     $error_ele.show();
                 }
            })
        }

        //用于显示错误
        function get_error_ele() {
            $error_ele = $(get_error_selector());
        }

        function get_error_selector() {
            return '#' + $ele.attr('name') + '-input-error';
        }

        function find_ele() {
            if (selector instanceof jQuery){
                $ele = selector;
            }else{
                $ele = $(selector);
            }  
        }

        //解析input规则
        function parse_rule() {
            var i;
            var rule_str = $ele.data('rule');
            if (!rule_str) return;

            var rule_arr = rule_str.split('|');
            /*转换为：
            [
                'pattern:^[.a-z0-9]$',
                'maxlength:10',
                'minlength:2',
                'nullable:false',
                'numeric:false'
            ]
            */
           for(i=0;i<rule_arr.length;i++){
               var item_str = rule_arr[i];
               var item_arr = item_str.split(':');
               rule[item_arr[0]] = JSON.parse(item_arr[1]);//用JSON.parse更严谨
           }
        }

        init();
    }
})