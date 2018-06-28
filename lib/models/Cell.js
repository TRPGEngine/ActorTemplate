function Cell(name) {
  this.visibility = true;
  this.name = name || '数据名';
  this.desc = '';
  this.default = ''; // 默认值, 若为expression则是表达式, 若为enum则是用逗号分隔的数组(如: str1,str2,str3)ss
  this.func = 'value'; //value or expression or enum
  this.type = 'string'; // string
  this.value = '';
  this.ext = {}; // 额外参数
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
    if(['value', 'expression', 'enum'].indexOf(val) === -1) {
      val = 'value';
    }
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
    if(this.func === 'enum') {
      // 限制输入值必须在枚举列表中
      var items = this.getEnumItems();
      if(items.indexOf(val) === -1) {
        val = items[0]
      }
    }
    this.value = val;
    return this;
  }else {
    return this.value;
  }
}
Cell.prototype.getEnumItems = function() {
  if(this.func === 'enum') {
    return this.default.split(',');
  }
}

module.exports = Cell;
