function Cell(name) {
  this.visibility = true;
  this.name = name || '数据名';
  this.default = '';// 默认值
  this.func = 'value';//value or expression
  this.type = 'string';
  this.value = '';
}

Cell.prototype.setVisibility = function(val) {
  if(!!val) {
    this.visibility = val;
    return this;
  }else {
    return this.visibility;
  }
}

Cell.prototype.setDefault = function(val) {
  if(!!val) {
    this.default = val;
    return this;
  }else {
    return this.default;
  }
}

Cell.prototype.setFunc = function(val) {
  if(!!val) {
    this.func = val;
    return this;
  }else {
    return this.func;
  }
}
Cell.prototype.setType = function(val) {
  if(!!val) {
    this.type = val;
    return this;
  }else {
    return this.type;
  }
}
Cell.prototype.setValue = function(val) {
  if(!!val) {
    this.value = val;
    return this;
  }else {
    return this.value;
  }
}

module.exports = Cell;
