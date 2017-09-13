let Cell = function() {
  this.visibility = true;
  this.name = '数据名';
  this.default = '';// 默认值
  this.func = 'value';//value or expression
  this.type = 'string';
  this.value = '';
}

module.exports = Cell;
