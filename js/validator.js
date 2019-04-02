// 给input内置一个独立的对象，用js构造对象constructor.
// 避免污染全局变量
$(function() {
  'use strict';

  window.Validator = function(val, rule) {
    // 总方法，给input调用
    this.is_valid = function(new_val) {
      var key;
      if (new_val !== undefined)
        val = new_val;

      // 如果不是必填项且用户未填写任何内容则直接判定为合法
      if (!rule.nullable && !val)
        return true;
      
      for (key in rule) {
        // 避免重复检查
        if (key === 'nullable') {
          continue;
        }

        // 调用rule中相对应方法
        // ()表示要触发
        var r = this['validate_' + key]();
        if (!r) return false;
      }

      return true;
    }

    // 判断最大数值
    this.validate_max = function() {
      val = parseFloat(val);
      return val <= rule.max;
    }

    // 判断最小数值
    this.validate_min = function() {
      val = parseFloat(val);
      return val >= rule.min;
    }

    // 判断最大长度
    this.validate_maxlength = function() {
      pre_maxl_minl();
      return val.length <= rule.maxlength;
    }

    // 判断最小长度
    this.validate_minlength = function() {
      pre_maxl_minl();
      return val.length >= rule.minlength;
    }

    // 判断内容不为空
    this.validate_nullable = function() {
      var real = $.trim(val);
      if (!real && real !== 0){
        return false;
      }
      return true;
    }
    
    // 判断是否数字
    this.validate_numeric = function() {
      return $.isNumeric(val);
    }

    // 匹配正则
    this.validate_pattern = function() {
      var reg = new RegExp(rule.pattern);
      return reg.test(val);
    }

    /* 用于完成this.validate_maxlength或this.validate_minlength
    的前置工作 */
    function pre_maxl_minl() {
      val = val.toString();
    }
  }
})