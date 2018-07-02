const Group = require('./Group');
const Cell = require('./Cell');
const utils = require('../utils');
const Sandbox = require('trpg-sandbox');
const sandbox = new Sandbox();

function Template (name) {
  this.name = name || '模板名';
  this.creator = '';
  this.createAt = new Date().valueOf();
  this.desc = '';
  this.table = [];
  this.states = [];
  this._groupIndex = 0;
  this._stateIndex = 0;
}

Template.prototype.insertGroup = function(group) {
  group.index = this._groupIndex;
  this._groupIndex++;

  this.table.push(group);
  return this;
}
Template.prototype.insertCell = function(cell) {
  this.table.push(cell);
  return this;
}
Template.prototype.getCells = function() {
  let list = [];
  for (let cell of this.table) {
    if(cell instanceof Cell) {
      list.push(cell)
    }else if(cell instanceof Group) {
      list = list.concat(cell.getCells());
    }else {
      throw new TypeError('unknown template type:', cell);
    }
  }

  return list;
}
Template.prototype.getCell = function(cellName) {
  let cells = this.getCells();
  for (let cell of cells) {
    if (cell.name === cellName) {
      return cell;
    }
  }
  return null;
}
Template.prototype.removeCell = function(cell) {
  for (var i = 0; i < this.table.length; i++) {
    let _cell = this.table[i];
    if(_cell instanceof Cell) {
      if(_cell === cell) {
        this.table.splice(i, 1);
        break;
      }
    }else if(_cell instanceof Group) {
      _cell.removeCell(cell);
    }
  }

  return this;
}
Template.prototype.insertState = function(state) {
  state.index = this._stateIndex;
  this._stateIndex++;

  this.states.push(state);
  return this;
}
Template.prototype.getStateEffects = function() {
  let list = [];
  let states = JSON.parse(JSON.stringify(this.states));
  states.sort((a, b) => b.priority - a.priority);
  for (let state of states) {
    let effects = state.effects;
    effects.sort((a, b) => b.priority - a.priority);
    for (let effect of effects) {
      list.push(...effect.attributes);
    }
  }

  return list;
}

Template.prototype.eval = function() {
  const cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    if(cell.func === 'value') {
      let name = cell.name;
      let value = cell.value || cell.default;
      data[name] = value
    }
  }

  for (var i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if(cell.func === 'expression') {
      try {
        let t = utils.parseExpression(cell.default, data);
        // cells[i].value = eval(t);
        cells[i].value = sandbox.run(t);
      }catch (err) {
        cells[i].value = '数据错误';
        console.error('数据解析错误', cell.value, err);
      }
    }
  }
  return this;
}

Template.prototype.evalState = function() {
  this.eval();
  const _e = function(str, def) {
    try {
      return sandbox.run(str);
    }catch (err) {
      console.error(err);
      return def;
    }
  }
  // 原始数据备份相互拷贝
  let cells = this.getCells();
  for (let cell of cells) {
    if (cell.originValue) {
      // 之前已经做过拷贝处理。计算前先恢复到原始数据
      cell.value = cell.originValue;
    }else {
      // 之前未进行过拷贝处理。计算前先保存原始数据备份
      cell.originValue = cell.value;
    };
  }

  // 设置效果
  const effects = this.getStateEffects();
  const appendEffects = [];// 如果是表达式类型的效果。则暂时存储，最后进行统一处理
  for (let effect of effects) {
    let cell = this.getCell(effect.name);
    if (cell) {
      if (cell.func === 'value') {
        cell.value = _e(`${cell.value}${effect.value}`, cell.value);
      }else {
        appendEffects.push(effect);
      }
    }
  }
  this.eval();

  // 处理appendEffects
  for (let effect of appendEffects) {
    let cell = this.getCell(effect.name);
    if (cell) {
      cell.value = _e(`${cell.value}${effect.value}`, cell.value);
    }
  }

  return this;
}

// 遍历所有dice方法的属性并生成表达式结果值
Template.prototype.generateRollResult = function() {
  const cells = this.getCells();

  for (var i = 0; i < cells.length; i++) {
    if(cells[i].func !== 'dice') continue;

    try {
      cells[i].value = sandbox.run(utils.parseDiceExpression(cells[i].default));
    } catch (err) {
      cells[i].value = '数据错误';
      console.error('数据解析错误', cells[i].value, err);
    }
  }
}

// 未加状态时的数据
Template.prototype.getOriginData = function() {
  let cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    let name = cell.name;
    let value = cell.originValue || cell.value;
    if(!value && cell.func === 'value') {
      value = cell.default;
    }
    data[name] = value
  }
  return data;
}
Template.prototype.getData = function() {
  let cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    let name = cell.name;
    let value = cell.value;
    if(!value && cell.func === 'value') {
      value = cell.default;
    }
    data[name] = value
  }
  return data;
}
Template.prototype.setData = function(obj) {
  let cells = this.getCells();
  for (let cell of cells) {
    let name = cell.name;
    if(obj[name]) {
      cell.value = obj[name];
    }
  }
  return this.eval();
}

module.exports = Template;
